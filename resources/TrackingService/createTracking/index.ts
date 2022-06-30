import { Lambda } from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import getCourses from '../getCourses';
import createCourse from '../createCourse';
import { createTracking } from './CreateTracking';

const invokeLambdaAndGetData = async (params: Lambda.InvocationRequest): Promise<any> => {
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

const GET_COURSE_DATA_FUNCTION_NAME = process.env.GET_COURSE_DATA_FUNCTION_NAME ? process.env.GET_COURSE_DATA_FUNCTION_NAME : "";

exports.handler = async (event: any): Promise<any> => {
  const { department, section, number, session, email, restricted } = JSON.parse(event.body);

  const getCoursesInput: [string] = [`${session} ${department} ${number} ${section}`];

  const getCourseResponse: AttributeMap[] = await getCourses(getCoursesInput);

  if (getCourseResponse.length === 0) {
    const getCourseDataParams: {
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
  
    const getCourseDataInvokeParams = {
      FunctionName: GET_COURSE_DATA_FUNCTION_NAME,
      Payload: Buffer.from(JSON.stringify(getCourseDataParams)),
    }

    const getCourseDataResponse: {
      department?: string,
      section?: string,
      number?: string,
      session?: string,
      title?: string,
      description?: string,
      error?: string,
    } = await invokeLambdaAndGetData(getCourseDataInvokeParams);

    if (getCourseDataResponse.error) {
      return {
        statusCode: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: getCourseDataResponse.error,
      };
    }

    const createCourseInput: {
      department: string,
      section: string,
      number: string,
      session: string,
      description: string,
      title: string,
    } = {
      department: getCourseDataResponse.department || "",
      section: getCourseDataResponse.section || "",
      number: getCourseDataResponse.number || "",
      session: getCourseDataResponse.session || "",
      description: getCourseDataResponse.description || "",
      title: getCourseDataResponse.title || "",
    }
  
    const createCourseResponse: boolean = await createCourse(createCourseInput);
    if (createCourseResponse === false) console.log("Could not create course as part of tracking workflow.");
  }

  const createTrackingInput: {
    department: string,
    section: string,
    number: string,
    session: string,
    email: string,
    restricted: string,
  } = {
    department: department,
    section: section,
    number: number,
    session: session,
    email: email,
    restricted: restricted,
  }

  const createTrackingResponse: boolean = await createTracking(createTrackingInput);

  return {
    statusCode: 201,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: createTrackingResponse,
  };
}
