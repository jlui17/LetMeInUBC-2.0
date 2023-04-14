import { CfnOutput, Duration, Stack } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  MethodLoggingLevel,
} from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

import { UserPool } from "aws-cdk-lib/aws-cognito";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { WEBSITE_URL } from "../../../resources/shared/Constants";
import { NotifyService } from "../../services/NotifyService";
import { RefreshAndNotifyService } from "../../services/RefreshAndNotifyService";
import { TrackingService } from "../../services/TrackingService";
import { WebService } from "../../services/WebService";

const CURRENT_SCHOOL_YEAR = "2023";
const REFRESH_INTERVAL = Duration.minutes(5);
const PAUSE_BETWEEN_REQUESTS = "0"; // seconds

export class ApiStack extends Stack {
  public readonly apiEndpoint: CfnOutput;

  constructor(
    scope: Construct,
    id: string,
    props: {
      userPool: UserPool;
    }
  ) {
    super(scope, id);

    const CONFIG = Secret.fromSecretNameV2(
      this,
      "NotifyService_CONFIG_SECRET",
      "CONFIG"
    ); // update pls

    const api = new apigateway.RestApi(this, "LetMeIn-API", {
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "Access-Control-Allow-Origins",
        ],
        allowMethods: ["GET", "POST", "DELETE"],
        allowCredentials: true,
        allowOrigins: [WEBSITE_URL],
      },

      deployOptions: {
        stageName: "v1",
        tracingEnabled: true,
        loggingLevel: MethodLoggingLevel.INFO,
      },
    });
    this.apiEndpoint = new CfnOutput(this, "API-Endpoint", {
      value: api.url,
    });

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "CoursesAPIAuthorizer",
      {
        cognitoUserPools: [props.userPool],
      }
    );

    const webService = new WebService(this, "WebService", {
      CURRENT_SCHOOL_YEAR: CURRENT_SCHOOL_YEAR,
      PAUSE_BETWEEN_REQUESTS: PAUSE_BETWEEN_REQUESTS,
    });

    const trackingTable = new dynamodb.Table(this, "Tracking", {
      partitionKey: { name: "courseName", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "email", type: dynamodb.AttributeType.STRING },
    });
    trackingTable.addGlobalSecondaryIndex({
      indexName: "emailIndex",
      partitionKey: { name: "email", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "courseName", type: dynamodb.AttributeType.STRING },
    });
    trackingTable.addGlobalSecondaryIndex({
      indexName: "courseIndex",
      partitionKey: { name: "courseName", type: dynamodb.AttributeType.STRING },
      sortKey: {
        name: "includeRestrictedSeats",
        type: dynamodb.AttributeType.STRING,
      },
    });
    const trackingService = new TrackingService(this, "TrackingService", {
      TRACKING_TABLE_NAME: trackingTable.tableName,
      EMAIL_INDEX_NAME: "emailIndex",
      COURSE_INDEX_NAME: "courseIndex",
      GET_COURSE_DATA_FUNCTION_NAME:
        webService.getCourseDataHandler.functionName,
    });
    const trackingRoute = api.root.addResource("tracking");
    trackingRoute.addMethod(
      "POST",
      new apigateway.LambdaIntegration(trackingService.createEndpointHandler),
      {
        authorizer,
        authorizationType: AuthorizationType.COGNITO,
      }
    );
    trackingRoute.addMethod(
      "GET",
      new apigateway.LambdaIntegration(trackingService.getEndpointHandler),
      {
        authorizer,
        authorizationType: AuthorizationType.COGNITO,
      }
    );
    trackingRoute.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(trackingService.deleteEndpointHandler),
      {
        authorizer,
        authorizationType: AuthorizationType.COGNITO,
      }
    );

    const notifyService = new NotifyService(this, "NotifyService", {
      CURRENT_SCHOOL_YEAR: CURRENT_SCHOOL_YEAR,
      EMAILER_PASSWORD:
        CONFIG.secretValueFromJson("EMAILER_PASSWORD").unsafeUnwrap(),
    });
    notifyService.handler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "SES:SendRawEmail"],
        resources: ["*"],
        effect: iam.Effect.ALLOW,
      })
    );

    const refreshAndNotifyService = new RefreshAndNotifyService(
      this,
      "RefreshAndNotifyService",
      {
        GET_AVAILABLE_COURSES:
          webService.getAvailableCoursesHandler.functionName,
        NOTIFY_CONTACTS: notifyService.handler.functionName,
        GET_ALL_COURSES: trackingService.getByAllCoursesHandler.functionName,
        GET_EMAILS: trackingService.getByCourseHandler.functionName,
        DELETE_TRACKING: trackingService.deleteHandler.functionName,
      }
    );

    const refreshAndNotifyPolicy = new iam.PolicyStatement({
      actions: ["lambda:*"],
      resources: ["arn:aws:lambda:us-west-2:*"],
    });
    refreshAndNotifyService.handler.role?.attachInlinePolicy(
      new iam.Policy(this, "refresh-and-notify-policy", {
        statements: [refreshAndNotifyPolicy],
      })
    );
    const eventRule = new events.Rule(this, "scheduleRule", {
      schedule: events.Schedule.rate(REFRESH_INTERVAL),
    });

    trackingTable.grantReadWriteData(trackingService.createEndpointHandler);
    trackingTable.grantReadData(trackingService.getEndpointHandler);
    trackingTable.grantReadData(trackingService.getByCourseHandler);
    trackingTable.grantReadData(trackingService.getByAllCoursesHandler);
    trackingTable.grantWriteData(trackingService.deleteHandler);
    trackingTable.grantWriteData(trackingService.deleteEndpointHandler);

    webService.getCourseDataHandler.grantInvoke(
      trackingService.createEndpointHandler
    );

    trackingService.getByAllCoursesHandler.grantInvoke(
      refreshAndNotifyService.handler
    );
    trackingService.getByCourseHandler.grantInvoke(
      refreshAndNotifyService.handler
    );
    trackingService.deleteEndpointHandler.grantInvoke(
      refreshAndNotifyService.handler
    );
    eventRule.addTarget(
      new targets.LambdaFunction(refreshAndNotifyService.handler)
    );
  }
}
