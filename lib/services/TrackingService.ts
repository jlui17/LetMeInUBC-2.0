import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class TrackingService extends Construct {
  public readonly createEndpointHandler: lambda.Function;
  public readonly deleteEndpointHandler: lambda.Function;
  public readonly deleteHandler: lambda.Function;
  public readonly getEndpointHandler: lambda.Function;
  public readonly getByCourseHandler: lambda.Function;
  public readonly getByAllCoursesHandler: lambda.Function;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    const RESOURCE_FOLDER = "resources/TrackingService";

    this.createEndpointHandler = new lambda.Function(
      this,
      "CreateEndpointTrackingHandler",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "createTracking/index.handler",
        code: lambda.Code.fromAsset(`${RESOURCE_FOLDER}`),
        environment: {
          GET_COURSE_DATA_FUNCTION_NAME: props.GET_COURSE_DATA_FUNCTION_NAME,
          TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
          COURSES_TABLE_NAME: props.COURSES_TABLE_NAME,
        },
      }
    );

    this.deleteHandler = new lambda.Function(this, "DeleteTrackingHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "DeleteTracking.handler",
      code: lambda.Code.fromAsset(`${RESOURCE_FOLDER}/deleteTracking`),
      environment: {
        TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
      },
    });

    this.deleteEndpointHandler = new lambda.Function(
      this,
      "DeleteEndpointTrackingHandler",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(`${RESOURCE_FOLDER}/deleteTracking`),
        environment: {
          TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
        },
      }
    );

    this.getEndpointHandler = new lambda.Function(
      this,
      "GetEndpointTrackingHandler",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(`${RESOURCE_FOLDER}/getTracking`),
        environment: {
          TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
          EMAIL_INDEX_NAME: props.EMAIL_INDEX_NAME,
          COURSE_INDEX_NAME: props.COURSE_INDEX_NAME,
        },
      }
    );

    this.getByCourseHandler = new lambda.Function(
      this,
      "GetTrackingByCourseHandler",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "GetTrackingByCourse.handler",
        code: lambda.Code.fromAsset(`${RESOURCE_FOLDER}/getTracking`),
        environment: {
          TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
          COURSE_INDEX_NAME: props.COURSE_INDEX_NAME,
        },
      }
    );

    this.getByAllCoursesHandler = new lambda.Function(
      this,
      "GetTrackingByAllCoursesHandler",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "GetTrackingByAllCourses.handler",
        code: lambda.Code.fromAsset(`${RESOURCE_FOLDER}/getTracking`),
        environment: {
          TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
        },
      }
    );

    this.deleteHandler.grantInvoke(this.deleteEndpointHandler);
  }
}
