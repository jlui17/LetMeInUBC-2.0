import * as cdk from 'aws-cdk-lib';
import * as lambda from '@aws-cdk/aws-lambda-python-alpha';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class WebService extends Construct {
  public readonly getAvailableCoursesHandler: lambda.PythonFunction;
  public readonly getCourseDataHandler: lambda.PythonFunction;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    const RESOURCE_FOLDER = 'resources/WebService'
    const webServiceDependencyLayer = new lambda.PythonLayerVersion(this, 'WebServiceDependencyLayer', {
      entry: RESOURCE_FOLDER
    })

    this.getAvailableCoursesHandler = new lambda.PythonFunction(this, 'GetAvailableCourses', {
      runtime: Runtime.PYTHON_3_7,
      index: 'GetAvailableCourses.py',
      handler: 'handler',
      entry: RESOURCE_FOLDER,
      timeout: cdk.Duration.minutes(5),
      environment: {
        'CURRENT_SCHOOL_YEAR': props.CURRENT_SCHOOL_YEAR,
        'PAUSE_BETWEEN_REQUESTS': props.PAUSE_BETWEEN_REQUESTS
      },
      layers: [
        webServiceDependencyLayer,
      ],
    });

    this.getCourseDataHandler = new lambda.PythonFunction(this, 'GetCourseData', {
      runtime: Runtime.PYTHON_3_7,
      index: 'GetCourseData.py',
      handler: 'handler',
      entry: RESOURCE_FOLDER,
      timeout: cdk.Duration.minutes(5),
      environment: {
        'CURRENT_SCHOOL_YEAR': props.CURRENT_SCHOOL_YEAR
      },
      layers: [
        webServiceDependencyLayer,
      ],
    });
  }
}
