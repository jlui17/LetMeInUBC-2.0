import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';

export class RefreshAndNotifyService extends Construct {
  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    const RESOURCE_FOLDER = lambda.Code.fromAsset('resources/RefreshAndNotifyService');

    this.handler = new NodejsFunction(this, 'RefreshAndNotify', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, '/../../resources/RefreshAndNotifyService/RefreshAndNotify.ts'),
      timeout: cdk.Duration.minutes(5),
      environment: {
        GET_TRACKING: props.GET_TRACKING,
        GET_AVAILABLE_COURSES: props.GET_AVAILABLE_COURSES,
        NOTIFY_CONTACTS: props.NOTIFY_CONTACTS,
      }
    });
    const refreshAndNotifyPolicy = new iam.PolicyStatement({
      actions: ['lambda:*'],
      resources: ['arn:aws:lambda:us-west-2:*'],
    });
    this.handler.role?.attachInlinePolicy(
      new iam.Policy(this, 'refresh-and-notify-policy', {
        statements: [refreshAndNotifyPolicy],
      }),
    );
  }
}
