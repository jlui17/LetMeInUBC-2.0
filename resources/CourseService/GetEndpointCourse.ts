import { Lambda } from 'aws-sdk';

const GET_COURSE_FUNCTION_NAME: string = process.env.GET_COURSE_FUNCTION_NAME ? process.env.GET_COURSE_FUNCTION_NAME : "";

const invokeLambdaAndGetData = async (params: Lambda.InvocationRequest): Promise<{
  title?: string,
  description?: string,
}> => {
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

exports.handler = async (event: any): Promise<any> => {
  const { department, section, number, session } = event.queryStringParameters;

  const getCourseParams: {
    department: string,
    section: string,
    number: string,
    session: string
  } = {
    department: department,
    section: section,
    number: number,
    session: session
  }

  const getCourseInvokeParams = {
    FunctionName: GET_COURSE_FUNCTION_NAME,
    Payload: Buffer.from(JSON.stringify(getCourseParams)),
  }

  const getCourseResponse: {
    title?: string,
    description?: string,
  } = await invokeLambdaAndGetData(getCourseInvokeParams);

  // if course not found in table
  if (Object.keys(getCourseResponse).length === 0) return {
    statusCode: 404
  }

  const response = {
    department: department,
    section: section,
    number: number,
    session: session,
    title: getCourseResponse.title,
    description: getCourseResponse.description,
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
}
