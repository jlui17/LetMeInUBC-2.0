import { Duration, Stack } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

export class RefreshAndNotifyService extends Stack {
  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);

    this.handler = new NodejsFunction(this, "RefreshAndNotify", {
      handler: "handler",
      entry: path.join(
        __dirname,
        "/../../resources/RefreshAndNotifyService/RefreshAndNotify.ts"
      ),
      timeout: Duration.minutes(5),
      environment: {
        GET_ALL_COURSES: props.GET_ALL_COURSES,
        GET_EMAILS: props.GET_EMAILS,
        GET_AVAILABLE_COURSES: props.GET_AVAILABLE_COURSES,
        NOTIFY_CONTACTS: props.NOTIFY_CONTACTS,
        DELETE_TRACKING: props.DELETE_TRACKING,
      },
    });
  }
}
