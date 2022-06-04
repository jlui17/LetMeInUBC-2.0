import { Lambda } from 'aws-sdk';

interface courseParams {
  department: string,
  section: string,
  number: string,
  session: string,
}

interface emailParams {
  email: string,
}

const invokeLambda = (params: Lambda.InvocationRequest) => {
  const lambda = new Lambda();

  return lambda.invoke(params).promise();
};

const getDataFromLambdaResponse = (response: any) => {
  return response.Payload;
}

exports.handler = async (event: any): Promise<any> => {
  const { key } = event.queryStringParameters;

  let invokeParams: Lambda.InvocationRequest;

  switch (key) {
    // get by course
    case 'courseName':
      const { department, section, number, session } = event.queryStringParameters;

      const courseParams: courseParams = {
        department: department,
        section: section,
        number: number,
        session: session
      }

      invokeParams = {
        FunctionName: process.env.getByCourseFunctionName ? process.env.getByCourseFunctionName : "",
        Payload: Buffer.from(JSON.stringify(courseParams)),
      }

      const lambdaResponse = await invokeLambda(invokeParams);
      const emails = getDataFromLambdaResponse(lambdaResponse);

      return {
        statusCode: 200,
        body: JSON.stringify(emails),
      };

    // get by email
    case 'email':
      const { email } = event.queryStringParameters;

    // get all courses being tracked
    case 'allCourses':
    
    // bad request, must specify key to query by
    default:
      return {
        statusCode: 400,
        body: "Your key should be one of 'courseName', 'email', or 'allCourses'."
      };
  }
}
