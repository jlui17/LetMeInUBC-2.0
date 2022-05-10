import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class TrackingService extends Construct {
  public readonly createHandler: lambda.Function;
  public readonly getHandler: lambda.Function;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    const RESOURCE_FOLDER = lambda.Code.fromAsset('resources/TrackingService');

    this.createHandler = new lambda.Function(this, 'CreateTrackingHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'CreateTracking.handler',
      code: RESOURCE_FOLDER,
      environment: {
        TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME
      }
    });

    this.getHandler = new lambda.Function(this, 'GetTrackingHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'GetTracking.handler',
      code: RESOURCE_FOLDER,
      environment: {
        TRACKING_TABLE_NAME: props.TRACKING_TABLE_NAME,
        EMAIL_INDEX_NAME: props.EMAIL_INDEX_NAME
      }
    })
  }
}
