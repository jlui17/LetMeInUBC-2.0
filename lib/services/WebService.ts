import * as lambda from "@aws-cdk/aws-lambda-python-alpha";
import { Duration, Stack } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class WebService extends Stack {
  public readonly getAvailableCoursesHandler: lambda.PythonFunction;
  public readonly getCourseDataHandler: lambda.PythonFunction;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);
    const RESOURCE_FOLDER = "resources/WebService";
    const webServiceDependencyLayer = new lambda.PythonLayerVersion(
      this,
      "WebServiceDependencyLayer",
      {
        entry: RESOURCE_FOLDER,
      }
    );

    this.getAvailableCoursesHandler = new lambda.PythonFunction(
      this,
      "GetAvailableCourses",
      {
        runtime: Runtime.PYTHON_3_7,
        index: "GetAvailableCourses.py",
        handler: "handler",
        entry: RESOURCE_FOLDER,
        timeout: Duration.minutes(5),
        environment: {
          CURRENT_SCHOOL_YEAR: props.CURRENT_SCHOOL_YEAR,
          PAUSE_BETWEEN_REQUESTS: props.PAUSE_BETWEEN_REQUESTS,
        },
        layers: [webServiceDependencyLayer],
      }
    );

    this.getCourseDataHandler = new lambda.PythonFunction(
      this,
      "GetCourseData",
      {
        runtime: Runtime.PYTHON_3_7,
        index: "GetCourseData.py",
        handler: "handler",
        entry: RESOURCE_FOLDER,
        timeout: Duration.minutes(5),
        environment: {
          CURRENT_SCHOOL_YEAR: props.CURRENT_SCHOOL_YEAR,
        },
        layers: [webServiceDependencyLayer],
      }
    );
  }
}
