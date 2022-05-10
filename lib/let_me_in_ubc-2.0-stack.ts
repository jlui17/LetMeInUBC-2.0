import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { CourseService } from './services/CourseService';
import { TrackingService } from './services/TrackingService';

export class LetMeInUbc20Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'CoursesAPI', {
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['GET', 'POST', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      },
    });

    const coursesTable = new dynamodb.Table(this, 'Courses', {
      partitionKey: { name: 'courseName', type: dynamodb.AttributeType.STRING },
    });
    const courseService = new CourseService(this, 'CourseService', {
      COURSES_TABLE_NAME: coursesTable.tableName
    });

    const trackingTable = new dynamodb.Table(this, 'Tracking', {
      partitionKey: { name: 'courseName', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'email', type: dynamodb.AttributeType.STRING }
    });
    trackingTable.addGlobalSecondaryIndex({
      indexName: 'emailIndex',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'courseName', type: dynamodb.AttributeType.STRING },
    });
    const trackingService = new TrackingService(this, 'TrackingService', {
      TRACKING_TABLE_NAME: trackingTable.tableName,
      EMAIL_INDEX_NAME: 'emailIndex'
    });
    
    const coursesRoute = api.root.addResource('courses');
    coursesRoute.addMethod('POST', new apigateway.LambdaIntegration(courseService.createHandler));
    coursesRoute.addMethod('GET', new apigateway.LambdaIntegration(courseService.getHandler));
    coursesTable.grantWriteData(courseService.createHandler);
    coursesTable.grantReadData(courseService.getHandler);

    const trackingRoute = api.root.addResource('tracking');
    trackingRoute.addMethod('POST', new apigateway.LambdaIntegration(trackingService.createHandler));
    trackingRoute.addMethod('GET', new apigateway.LambdaIntegration(trackingService.getHandler));
    trackingTable.grantWriteData(trackingService.createHandler);
    trackingTable.grantReadData(trackingService.getHandler);
  }
}
