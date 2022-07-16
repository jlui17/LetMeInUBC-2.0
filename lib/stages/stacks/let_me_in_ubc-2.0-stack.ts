import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import {
  AuthorizationType,
  AwsIntegration,
  CognitoUserPoolsAuthorizer,
  Cors,
  MethodLoggingLevel,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { SPADeploy } from "cdk-spa-deploy";
import {
  UserPool,
  OAuthScope,
  VerificationEmailStyle,
  CfnUserPoolResourceServer,
} from "aws-cdk-lib/aws-cognito";

import { TrackingService } from "../../services/TrackingService";
import { WebService } from "../../services/WebService";
import { NotifyService } from "../../services/NotifyService";
import { RefreshAndNotifyService } from "../../services/RefreshAndNotifyService";
import * as iam from "aws-cdk-lib/aws-iam";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";

const CURRENT_SCHOOL_YEAR = "2022";
const REFRESH_INTERVAL = Duration.minutes(5);
const PAUSE_BETWEEN_REQUESTS = "0"; // seconds

export class LetMeInUbc20Stack extends Stack {
  public readonly apiEndpoint: CfnOutput;
  public readonly websiteUrl: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Create Cognito User Pool
    const pool = new UserPool(this, "MyPool", {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },

      userVerification: {
        emailSubject: "Verify email for LetMeInUBC",
        emailBody:
          "Thanks for signing up for LetMeInUBC! Your verification code is {####}",
        emailStyle: VerificationEmailStyle.CODE,
        smsMessage:
          "Thanks for signing up for LetMeInUBC! Your verification code is {####}",
      },
    });

    //Create SPA - Cloudfront-SPA for in-built https support, deploy first to get URL
    const spa_app = new SPADeploy(this, "spaDeploy").createSiteWithCloudfront({
      indexDoc: "index.html",
      websiteFolder: "letmeinubc-react/build",
      certificateARN:
        "arn:aws:acm:us-east-1:284333539126:certificate/24d8066b-bc55-4146-be81-09ed591b064f",
      cfAliases: ["letmeinubc.com"],
    });
    this.websiteUrl = new CfnOutput(this, "LetMeInUBC-Website-URL", {
      value: "letmeinubc.com",
    });

    // Create App client for authorization
    pool.addClient("app-client", {
      oAuth: {
        flows: {
          implicitCodeGrant: true, //generates JWT
        },
        scopes: [OAuthScope.OPENID],
        callbackUrls: [`https://${this.websiteUrl.value}/dashboard`], //Must begin with HTTPS else Validation Error
      },
    });

    pool.addDomain("LetMeInUBC", {
      cognitoDomain: {
        domainPrefix: "letmeinubc",
      },
    });

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
        allowOrigins: Cors.ALL_ORIGINS,
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
        cognitoUserPools: [pool],
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
      GET_WEBSITE_URL: `https://${this.websiteUrl.value}`,
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
