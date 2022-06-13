import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class TrackingService extends Construct {
  public readonly createEndpointHandler: lambda.Function;
  public readonly createHandler: lambda.Function;
  public readonly deleteEndpointHandler: lambda.Function
  public readonly getEndpointHandler: lambda.Function;
  public readonly getByEmailHandler: lambda.Function;
  public readonly getByCourseHandler: lambda.Function;
  public readonly getByAllCoursesHandler: lambda.Function;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    const RESOURCE_FOLDER = lambda.Code.fromAsset('resources/TrackingService');

    this.getByEmailHandler = new lambda.Function(this, 'GetTrackingByEmailHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'GetTrackingByEmail.handler',
      code: RESOURCE_FOLDER,
      environment: {
        TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
        EMAIL_INDEX_NAME: props.EMAIL_INDEX_NAME
      }
    });

    this.getByCourseHandler = new lambda.Function(this, 'GetTrackingByCourseHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'GetTrackingByCourse.handler',
      code: RESOURCE_FOLDER,
      environment: {
        TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME
      }
    });

    this.getByAllCoursesHandler = new lambda.Function(this, 'GetTrackingByAllCoursesHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'GetTrackingByAllCourses.handler',
      code: RESOURCE_FOLDER,
      environment: {
        TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME
      }
    });

    this.createHandler = new lambda.Function(this, 'CreateTrackingHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'CreateTracking.handler',
      code: RESOURCE_FOLDER,
      environment: {
        TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME
      }
    });

    this.createEndpointHandler = new lambda.Function(this, 'CreateEndpointTrackingHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'CreateEndpointTracking.handler',
      code: RESOURCE_FOLDER,
      environment: {
        createTrackingFunctionName: this.createHandler.functionName
      }
    });

    this.deleteEndpointHandler = new lambda.Function(this, 'DeleteEndpointTrackingHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'DeleteEndpointTracking.handler',
      code: RESOURCE_FOLDER,
      environment: {
        TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME
      }
    });

    this.getEndpointHandler = new lambda.Function(this, 'GetEndpointTrackingHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'GetEndpointTracking.handler',
      code: RESOURCE_FOLDER,
      environment: {
        getByEmailFunctionName: this.getByEmailHandler.functionName,
        getByCourseFunctionName: this.getByCourseHandler.functionName,
        getByAllCoursesFunctionName: this.getByAllCoursesHandler.functionName,
      }
    });

    this.createHandler.grantInvoke(this.createEndpointHandler);
    this.getByAllCoursesHandler.grantInvoke(this.getEndpointHandler);
    this.getByCourseHandler.grantInvoke(this.getEndpointHandler);
    this.getByEmailHandler.grantInvoke(this.getEndpointHandler);
  }
}
