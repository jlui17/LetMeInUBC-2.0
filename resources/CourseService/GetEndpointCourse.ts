import { Lambda } from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';

const GET_COURSE_FUNCTION_NAME: string = process.env.GET_COURSE_FUNCTION_NAME ? process.env.GET_COURSE_FUNCTION_NAME : "";

const invokeLambdaAndGetData = async (params: Lambda.InvocationRequest): Promise<AttributeMap[]> => {
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
  const courseNames: { 
    department: string, 
    section: string, 
    number: string, 
    session: string }[] = JSON.parse(event.body);

  const getCourseParams: string[] = courseNames.map((course) => {
    const { session, department, number, section } = course;
    return `${session} ${department} ${number} ${section}`;
  });

  const getCourseInvokeParams = {
    FunctionName: GET_COURSE_FUNCTION_NAME,
    Payload: Buffer.from(JSON.stringify(getCourseParams)),
  }

  const getCourseResponse = await invokeLambdaAndGetData(getCourseInvokeParams);

  // if course not found in table
  if (getCourseResponse.length === 0) return {
    statusCode: 404
  }

  return {
    statusCode: 200,
    body: JSON.stringify(getCourseResponse)
  };
}
