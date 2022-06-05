import { Lambda } from 'aws-sdk';

const invokeLambdaAndGetData = async (params: Lambda.InvocationRequest) => {
  const invokeLambda = (params: Lambda.InvocationRequest) => {
    const lambda = new Lambda();

    return lambda.invoke(params).promise();
  };

  const getDataFromLambdaResponse = (response: any) => {
    return response.Payload;
  }

  const response = await invokeLambda(params);

  return JSON.parse(getDataFromLambdaResponse(response));
};

interface courseParams {
  department: string,
  section: string,
  number: string,
  session: string,
}

interface emailParams {
  email: string,
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

      const emails: string[] = await invokeLambdaAndGetData(invokeParams);

      if (emails.length === 0) 
        return {
          statusCode: 404
        };

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
