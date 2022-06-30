import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class CourseService extends Construct {
  public readonly getEndpointHandler: lambda.Function;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    const RESOURCE_FOLDER = 'resources/TrackingService';

    this.getEndpointHandler = new lambda.Function(this, 'GetCourseEndpointHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(`${RESOURCE_FOLDER}/getCourses`),
      environment: {
        COURSES_TABLE_NAME: props.COURSES_TABLE_NAME
      }
    });
  }
}
