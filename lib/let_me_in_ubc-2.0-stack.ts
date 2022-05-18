import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Stack, StackProps } from 'aws-cdk-lib';
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
// import { RefreshAndNotify } from "./services/RefreshAndNotify";

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
        allowOrigins: ["https://dxi81lck7ldij.cloudfront.net"],
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
      partitionKey: { name: "courseName", type: dynamodb.AttributeType.STRING },
    });
    const courseService = new CourseService(this, "CourseService", {
      COURSES_TABLE_NAME: coursesTable.tableName,
    });
    const coursesRoute = api.root.addResource("courses");
    coursesRoute.addMethod(
      "POST",
      new apigateway.LambdaIntegration(courseService.createHandler),
      {
        authorizer,
        authorizationType: AuthorizationType.COGNITO,
      }
    );
    coursesRoute.addMethod(
      "GET",
      new apigateway.LambdaIntegration(courseService.getHandler),
      {
        authorizer,
        authorizationType: AuthorizationType.COGNITO,
      }
    );
    coursesTable.grantWriteData(courseService.createHandler);
    coursesTable.grantReadData(courseService.getHandler);

    const trackingTable = new dynamodb.Table(this, "Tracking", {
      partitionKey: { name: "courseName", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "email", type: dynamodb.AttributeType.STRING },
    });
    trackingTable.addGlobalSecondaryIndex({
      indexName: "emailIndex",
      partitionKey: { name: "email", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "courseName", type: dynamodb.AttributeType.STRING },
    });
    const trackingService = new TrackingService(this, "TrackingService", {
      TRACKING_TABLE_NAME: trackingTable.tableName,
      EMAIL_INDEX_NAME: "emailIndex",
    });
    const trackingRoute = api.root.addResource("tracking");
    trackingRoute.addMethod(
      "POST",
      new apigateway.LambdaIntegration(trackingService.createHandler),
      {
        authorizer,
        authorizationType: AuthorizationType.COGNITO,
      }
    );
    trackingRoute.addMethod(
      "GET",
      new apigateway.LambdaIntegration(trackingService.getHandler),
      {
        authorizer,
        authorizationType: AuthorizationType.COGNITO,
      }
    );
    trackingRoute.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(trackingService.deleteHandler),
      {
        authorizer,
        authorizationType: AuthorizationType.COGNITO,
      }
    );
    trackingTable.grantWriteData(trackingService.createHandler);
    trackingTable.grantReadData(trackingService.getHandler);
    trackingTable.grantWriteData(trackingService.deleteHandler);

    const webService = new WebService(this, "WebService", {
      CURRENT_SCHOOL_YEAR: CURRENT_SCHOOL_YEAR,
    });

    const notifyService = new NotifyService(this, "NotifyService", {
      CURRENT_SCHOOL_YEAR: CURRENT_SCHOOL_YEAR,
    });

    // const refreshAndNotifyService = new RefreshAndNotify(
    //   this,
    //   "RefreshAndNotifyService",
    //   {
    //     GET_AVAILABLE_COURSES: webService.handler,
    //     NOTIFY_CONTACTS: notifyService.handler,
    //     GET_COURSES: courseService.getHandler,
    //   }
    // );

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
