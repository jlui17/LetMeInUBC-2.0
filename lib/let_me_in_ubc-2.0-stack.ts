import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import {
  AuthorizationType,
  AwsIntegration,
  CognitoUserPoolsAuthorizer,
  MethodLoggingLevel,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { SPADeploy } from "cdk-spa-deploy";
import {
  UserPool,
  OAuthScope,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito";

import { CourseService } from "./services/CourseService";
import { TrackingService } from "./services/TrackingService";
import { WebService } from "./services/WebService";
import { NotifyService } from "./services/NotifyService";
import { RefreshAndNotifyService } from "./services/RefreshAndNotifyService";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events'
import * as targets from 'aws-cdk-lib/aws-events-targets'

const CURRENT_SCHOOL_YEAR = "2021";

export class LetMeInUbc20Stack extends Stack {
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

    const api = new apigateway.RestApi(this, "CoursesAPI", {
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["GET", "POST", "DELETE"],
        allowCredentials: true,
        //"https://dxi81lck7ldij.cloudfront.net"
        allowOrigins: ["*"],
      },

      deployOptions: {
        stageName: "v1",
        tracingEnabled: true,
        loggingLevel: MethodLoggingLevel.INFO,
      },
    });

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "CoursesAPIAuthorizer",
      {
        cognitoUserPools: [pool],
      }
    );

    const coursesTable = new dynamodb.Table(this, "Courses", {
      partitionKey: { name: "session", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "department", type: dynamodb.AttributeType.STRING },
    });
    const courseService = new CourseService(this, "CourseService", {
      COURSES_TABLE_NAME: coursesTable.tableName,
    });
    const coursesRoute = api.root.addResource("courses");
    coursesRoute.addMethod(
      "GET",
      new apigateway.LambdaIntegration(courseService.getEndpointHandler),
      // {
      //   authorizer,
      //   authorizationType: AuthorizationType.COGNITO,
      // }
    );
    coursesRoute.addMethod(
      "POST",
      new apigateway.LambdaIntegration(courseService.getEndpointHandler),
      {
        authorizer,
        authorizationType: AuthorizationType.COGNITO,
      }
    );
    coursesTable.grantWriteData(courseService.createHandler);
    coursesTable.grantReadData(courseService.getEndpointHandler);

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
      sortKey: { name: "includeRestrictedSeats", type: dynamodb.AttributeType.STRING },
    });
    const trackingService = new TrackingService(this, "TrackingService", {
      TRACKING_TABLE_NAME: trackingTable.tableName,
      EMAIL_INDEX_NAME: "emailIndex",
      COURSE_INDEX_NAME: "courseIndex"
    });
    const trackingRoute = api.root.addResource("tracking");
    trackingRoute.addMethod(
      "POST",
      new apigateway.LambdaIntegration(trackingService.createEndpointHandler),
      // {
      //   authorizer,
      //   authorizationType: AuthorizationType.COGNITO,
      // }
    );
    trackingRoute.addMethod(
      "GET",
      new apigateway.LambdaIntegration(trackingService.getEndpointHandler),
      // {
      //   authorizer,
      //   authorizationType: AuthorizationType.COGNITO,
      // }
    );
    trackingRoute.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(trackingService.deleteEndpointHandler),
      // {
      //   authorizer,
      //   authorizationType: AuthorizationType.COGNITO,
      // }
    );
    trackingTable.grantWriteData(trackingService.createHandler);
    trackingTable.grantReadData(trackingService.getByEmailHandler);
    trackingTable.grantReadData(trackingService.getByCourseHandler);
    trackingTable.grantReadData(trackingService.getByAllCoursesHandler);
    trackingTable.grantWriteData(trackingService.deleteEndpointHandler);

    const webService = new WebService(this, "WebService", {
      CURRENT_SCHOOL_YEAR: CURRENT_SCHOOL_YEAR,
    });

    const notifyService = new NotifyService(this, "NotifyService", {
      CURRENT_SCHOOL_YEAR: CURRENT_SCHOOL_YEAR,
    });
    notifyService.handler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'SES:SendRawEmail'],
      resources: ['*'],
      effect: iam.Effect.ALLOW,
    }));

    const refreshAndNotifyService = new RefreshAndNotifyService(this, "RefreshAndNotifyService",
      {
        GET_AVAILABLE_COURSES: webService.getAvailableCoursesHandler.functionName,
        NOTIFY_CONTACTS: notifyService.handler.functionName,
        GET_ALL_COURSES: trackingService.getByAllCoursesHandler.functionName,
        GET_EMAILS: trackingService.getByCourseHandler.functionName,
        DELETE_TRACKING: trackingService.deleteEndpointHandler.functionName,
      }
    );

    const refreshAndNotifyPolicy = new iam.PolicyStatement({
      actions: ['lambda:*'],
      resources: ['arn:aws:lambda:us-west-2:*'],
    });
    refreshAndNotifyService.handler.role?.attachInlinePolicy(
      new iam.Policy(this, 'refresh-and-notify-policy', {
        statements: [refreshAndNotifyPolicy],
      }),
    );
    const eventRule = new events.Rule(this, 'scheduleRule', {
      schedule: events.Schedule.rate(Duration.minutes(5)),
    })
    trackingService.getByAllCoursesHandler.grantInvoke(refreshAndNotifyService.handler);
    trackingService.getByCourseHandler.grantInvoke(refreshAndNotifyService.handler);
    trackingService.deleteEndpointHandler.grantInvoke(refreshAndNotifyService.handler);
    eventRule.addTarget(new targets.LambdaFunction(refreshAndNotifyService.handler));

    //Create SPA - Cloudfront-SPA for in-built https support, deploy first to get URL
    const spa_app = new SPADeploy(this, "spaDeploy").createSiteWithCloudfront({
      indexDoc: "index.html",
      websiteFolder: "letmeinubc-react/build",
    });

    // Create App client for authorization
    pool.addClient("app-client", {
      oAuth: {
        flows: {
          implicitCodeGrant: true, //generates JWT
        },
        scopes: [OAuthScope.OPENID],
        callbackUrls: ["https://dxi81lck7ldij.cloudfront.net"], //Must begin with HTTPS else Validation Error
      },
    });

    pool.addDomain("LetMeInUBC", {
      cognitoDomain: {
        domainPrefix: "letmeinubc",
      },
    });
  }
}
