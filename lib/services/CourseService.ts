import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class CourseService extends Construct {
  public readonly createHandler: lambda.Function;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);

    this.createHandler = new lambda.Function(this, 'CreateCoursesHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'CreateCourse.handler',
      code: lambda.Code.fromAsset('resources'),
      environment: {
        COURSES_TABLE_NAME: props.COURSES_TABLE_NAME
      }
    });

    const api = new apigateway.RestApi(this, 'CoursesAPI', {
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      },
    });

    const coursesRoute = api.root.addResource('courses');

    coursesRoute.addMethod('POST', new apigateway.LambdaIntegration(this.createHandler, {proxy: true}));
  }
}
