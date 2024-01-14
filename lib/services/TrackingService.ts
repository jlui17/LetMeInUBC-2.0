import { Stack } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class TrackingService extends Stack {
  public readonly createEndpointHandler: NodejsFunction;
  public readonly deleteEndpointHandler: NodejsFunction;
  public readonly deleteHandler: NodejsFunction;
  public readonly getEndpointHandler: NodejsFunction;
  public readonly getByCourseHandler: NodejsFunction;
  public readonly getByAllCoursesHandler: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    props: {
      GET_COURSE_DATA_FUNCTION_NAME: string;
    }
  ) {
    super(scope, id);
    const RESOURCE_FOLDER = "resources/TrackingService";
    const EMAIL_INDEX_NAME = "emailIndex";
    const COURSE_INDEX_NAME = "courseIndex";

    const trackingTable = new dynamodb.Table(this, "Tracking", {
      partitionKey: { name: "courseName", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "email", type: dynamodb.AttributeType.STRING },
    });
    trackingTable.addGlobalSecondaryIndex({
      indexName: EMAIL_INDEX_NAME,
      partitionKey: { name: "email", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "courseName", type: dynamodb.AttributeType.STRING },
    });
    trackingTable.addGlobalSecondaryIndex({
      indexName: COURSE_INDEX_NAME,
      partitionKey: { name: "courseName", type: dynamodb.AttributeType.STRING },
      sortKey: {
        name: "includeRestrictedSeats",
        type: dynamodb.AttributeType.STRING,
      },
    });

    this.createEndpointHandler = new NodejsFunction(
      this,
      "CreateEndpointTrackingHandler",
      {
        handler: "handler",
        entry: `${RESOURCE_FOLDER}/createTracking/index.ts`,
        environment: {
          GET_COURSE_DATA_FUNCTION_NAME: props.GET_COURSE_DATA_FUNCTION_NAME,
          TRACKING_TABLE_NAME: trackingTable.tableName,
        },
      }
    );

    this.deleteHandler = new NodejsFunction(this, "DeleteTrackingHandler", {
      handler: "deleteTracking",
      entry: `${RESOURCE_FOLDER}/deleteTracking/DeleteTracking.ts`,
      environment: {
        TRACKING_TABLE_NAME: trackingTable.tableName,
      },
    });

    this.deleteEndpointHandler = new NodejsFunction(
      this,
      "DeleteEndpointTrackingHandler",
      {
        handler: "handler",
        entry: `${RESOURCE_FOLDER}/deleteTracking/index.ts`,
        environment: {
          TRACKING_TABLE_NAME: trackingTable.tableName,
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
          TRACKING_TABLE_NAME: trackingTable.tableName,
          EMAIL_INDEX_NAME: EMAIL_INDEX_NAME,
          COURSE_INDEX_NAME: COURSE_INDEX_NAME,
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
          TRACKING_TABLE_NAME: trackingTable.tableName,
          COURSE_INDEX_NAME: COURSE_INDEX_NAME,
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
          TRACKING_TABLE_NAME: trackingTable.tableName,
        },
      }
    );

    this.deleteHandler.grantInvoke(this.deleteEndpointHandler);

    trackingTable.grantReadWriteData(this.createEndpointHandler);
    trackingTable.grantReadData(this.getEndpointHandler);
    trackingTable.grantReadData(this.getByCourseHandler);
    trackingTable.grantReadData(this.getByAllCoursesHandler);
    trackingTable.grantWriteData(this.deleteHandler);
    trackingTable.grantWriteData(this.deleteEndpointHandler);
  }
}
