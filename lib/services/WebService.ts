import * as cdk from 'aws-cdk-lib';
import * as lambda from '@aws-cdk/aws-lambda-python';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda'

export class WebService extends Construct {
  public readonly handler: lambda.PythonFunction;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    const RESOURCE_FOLDER = 'resources/WebService'

    this.handler = new lambda.PythonFunction(this, 'GetAvailableCourses', {
      runtime: Runtime.PYTHON_3_9,
      index: 'GetAvailableCourses',
      handler: 'handler',
      entry: RESOURCE_FOLDER,
      environment: {
        CURRENT_SCHOOL_YEAR: props.CURRENT_SCHOOL_YEAR
      },
      layers: [
        new lambda.PythonLayerVersion(this, 'WebServiceDependencyLayer', {
          entry: RESOURCE_FOLDER // point this to your library's directory
        }),
      ],
    });
  }
}
