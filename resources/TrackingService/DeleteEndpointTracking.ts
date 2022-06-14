import { Lambda } from 'aws-sdk';

const invokeLambdaAndGetData = async (params: Lambda.InvocationRequest): Promise<string> => {
  const invokeLambda = (params: Lambda.InvocationRequest) => {
      const lambda = new Lambda();

      return lambda.invoke(params).promise();
  };

  const getDataFromLambdaResponse = (response: Lambda.InvocationResponse): string => {
      return response.Payload ? response.Payload?.toString() : "";
  }

  const response = await invokeLambda(params);

  return JSON.parse(getDataFromLambdaResponse(response));
};

const DELETE_TRACKING_FUNCTION_NAME: string = process.env.DELETE_TRACKING_FUNCTION_NAME ? process.env.DELETE_TRACKING_FUNCTION_NAME : "";

interface courseParams {
  department: string,
  section: string,
  number: string,
  session: string,
  email: string,
}

exports.handler = async (event: any): Promise<any> => {
  const { department, section, number, session, email } = JSON.parse(event.body);
  const courseName = `${session} ${department} ${number} ${section}`

  const courseParams: courseParams = {
    department: department,
    section: section,
    number: number,
    session: session,
    email: email,
  }

  const invokeParams = {
    FunctionName: DELETE_TRACKING_FUNCTION_NAME,
    Payload: Buffer.from(JSON.stringify(courseParams)),
  }

  const response: string = await invokeLambdaAndGetData(invokeParams);

  return {
    statusCode: 200
  }
}
