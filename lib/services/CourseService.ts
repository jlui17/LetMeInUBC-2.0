import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class CourseService extends Construct {
  public readonly createHandler: lambda.Function;
  public readonly getHandler: lambda.Function;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    const RESOURCE_FOLDER = lambda.Code.fromAsset('resources/CourseService');

    this.createHandler = new lambda.Function(this, 'CreateCourseHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'CreateCourse.handler',
      code: RESOURCE_FOLDER,
      environment: {
        COURSES_TABLE_NAME: props.COURSES_TABLE_NAME
      }
    });

    this.getHandler = new lambda.Function(this, 'GetCourseHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'GetCourse.handler',
      code: RESOURCE_FOLDER,
      environment: {
        COURSES_TABLE_NAME: props.COURSES_TABLE_NAME
      }
    });
  }
}
