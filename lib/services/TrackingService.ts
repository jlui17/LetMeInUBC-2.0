import { Stack } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class TrackingService extends Stack {
  public readonly createEndpointHandler: NodejsFunction;
  public readonly deleteEndpointHandler: NodejsFunction;
  public readonly deleteHandler: NodejsFunction;
  public readonly getEndpointHandler: NodejsFunction;
  public readonly getByCourseHandler: NodejsFunction;
  public readonly getByAllCoursesHandler: NodejsFunction;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    const RESOURCE_FOLDER = "resources/TrackingService";

    this.createEndpointHandler = new NodejsFunction(
      this,
      "CreateEndpointTrackingHandler",
      {
        handler: "handler",
        entry: `${RESOURCE_FOLDER}/createTracking/index.ts`,
        environment: {
          GET_COURSE_DATA_FUNCTION_NAME: props.GET_COURSE_DATA_FUNCTION_NAME,
          TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
          COURSES_TABLE_NAME: props.COURSES_TABLE_NAME,
        },
      }
    );

    this.deleteHandler = new NodejsFunction(this, "DeleteTrackingHandler", {
      handler: "deleteTracking",
      entry: `${RESOURCE_FOLDER}/deleteTracking/DeleteTracking.ts`,
      environment: {
        TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
      },
    });

    this.deleteEndpointHandler = new NodejsFunction(
      this,
      "DeleteEndpointTrackingHandler",
      {
        handler: "handler",
        entry: `${RESOURCE_FOLDER}/deleteTracking/index.ts`,
        environment: {
          TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
        },
      }
    );

    this.getEndpointHandler = new NodejsFunction(
      this,
      "GetEndpointTrackingHandler",
      {
        handler: "handler",
        entry: `${RESOURCE_FOLDER}/getTracking/index.ts`,
        environment: {
          TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
          EMAIL_INDEX_NAME: props.EMAIL_INDEX_NAME,
          COURSE_INDEX_NAME: props.COURSE_INDEX_NAME,
        },
      }
    );

    this.getByCourseHandler = new NodejsFunction(
      this,
      "GetTrackingByCourseHandler",
      {
        handler: "getTrackingByCourse",
        entry: `${RESOURCE_FOLDER}/getTracking/GetTrackingByCourse.ts`,
        environment: {
          TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
          COURSE_INDEX_NAME: props.COURSE_INDEX_NAME,
        },
      }
    );

    this.getByAllCoursesHandler = new NodejsFunction(
      this,
      "GetTrackingByAllCoursesHandler",
      {
        handler: "getTrackingByAllCourses",
        entry: `${RESOURCE_FOLDER}/getTracking/GetTrackingByAllCourses.ts`,
        environment: {
          TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
        },
      }
    );

    this.deleteHandler.grantInvoke(this.deleteEndpointHandler);
  }
}
