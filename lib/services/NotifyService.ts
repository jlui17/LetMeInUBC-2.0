import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class NotifyService extends Construct {
  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    const RESOURCE_FOLDER = 'resources/NotifyService'

    this.handler = new NodejsFunction(this, 'RefreshAndNotify', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, '/../../resources/NotifyService/Emailer.ts'),
      timeout: cdk.Duration.minutes(5),
      environment: {
        'CURRENT_SCHOOL_YEAR': props.CURRENT_SCHOOL_YEAR
      }
    });
  }
}
