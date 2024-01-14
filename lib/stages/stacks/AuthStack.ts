import { Stack } from "aws-cdk-lib";
import {
  OAuthScope,
  UserPool,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { WEBSITE_URL } from "../../../resources/shared/Constants";

export class AuthStack extends Stack {
  public readonly userPool: UserPool;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.userPool = new UserPool(this, "users", {
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

    // Create App client for authorization
    this.userPool.addClient("users-pool-client", {
      oAuth: {
        flows: {
          implicitCodeGrant: true, //generates JWT
        },
        scopes: [OAuthScope.OPENID],
        callbackUrls: [`${WEBSITE_URL}/dashboard`], //Must begin with HTTPS else Validation Error
      },
    });

    this.userPool.addDomain("LetMeInUBC", {
      cognitoDomain: {
        domainPrefix: "letmeinubc",
      },
    });
  }
}
