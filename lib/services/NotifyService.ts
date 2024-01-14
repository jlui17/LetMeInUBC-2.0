import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

export class NotifyService extends Construct {
  public readonly handler: lambda.Function;

  constructor(
    scope: Construct,
    id: string,
    props: {
      CURRENT_SCHOOL_YEAR: string;
      EMAILER_PASSWORD: string;
    }
  ) {
    super(scope, id);

    this.handler = new NodejsFunction(this, "RefreshAndNotify", {
      handler: "handler",
      entry: path.join(__dirname, "/../../resources/NotifyService/Emailer.ts"),
      timeout: cdk.Duration.minutes(5),
      environment: {
        CURRENT_SCHOOL_YEAR: props.CURRENT_SCHOOL_YEAR,
        EMAILER_USER: "letmeinubc@gmail.com",
        EMAILER_PASS: props.EMAILER_PASSWORD,
      },
    });
  }
}
