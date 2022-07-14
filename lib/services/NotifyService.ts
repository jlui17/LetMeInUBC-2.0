import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";

export class NotifyService extends Construct {
  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    const RESOURCE_FOLDER = "resources/NotifyService";

    const EMAILER_SECRETS = Secret.fromSecretNameV2(
      this,
      "ImportedEmailerSecret",
      "EMAILER_ACCOUNT_INFO"
    );

    this.handler = new NodejsFunction(this, "RefreshAndNotify", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "handler",
      entry: path.join(__dirname, "/../../resources/NotifyService/Emailer.ts"),
      timeout: cdk.Duration.minutes(5),
      environment: {
        CURRENT_SCHOOL_YEAR: props.CURRENT_SCHOOL_YEAR,
        EMAILER_USER:
          EMAILER_SECRETS.secretValueFromJson("EMAILER_USER").toString() || "",
        EMAILER_PASS:
          EMAILER_SECRETS.secretValueFromJson("EMAILER_PASS").toString() || "",
      },
    });
  }
}
