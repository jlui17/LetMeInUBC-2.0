import { Lambda } from "aws-sdk";
import { CORS_ORIGIN_HEADER } from "../../shared/Constants";
import { getCourseDataIfAvailable } from "../getTracking/getCourseDataIfAvailable";
import { createTracking } from "./CreateTracking";

const invokeLambdaAndGetData = async (
  params: Lambda.InvocationRequest
): Promise<any> => {
  const invokeLambda = (params: Lambda.InvocationRequest) => {
    const lambda = new Lambda();

    return lambda.invoke(params).promise();
  };

  const getDataFromLambdaResponse = (
    response: Lambda.InvocationResponse
  ): string => {
    return response.Payload ? response.Payload?.toString() : "";
  };

  const response = await invokeLambda(params);

  return JSON.parse(getDataFromLambdaResponse(response));
};

const GET_COURSE_DATA_FUNCTION_NAME = process.env.GET_COURSE_DATA_FUNCTION_NAME
  ? process.env.GET_COURSE_DATA_FUNCTION_NAME
  : "";

exports.handler = async (event: any): Promise<any> => {
  const { department, section, number, session, email, restricted } =
    JSON.parse(event.body);
  const courseName = `${session} ${department} ${number} ${section}`;

  let courseData = await getCourseDataIfAvailable(courseName);

  if (courseData?.length === 0) {
    const getCourseDataParams = {
      department: department,
      section: section,
      number: number,
      session: session,
    };

    const getCourseDataInvokeParams = {
      FunctionName: GET_COURSE_DATA_FUNCTION_NAME,
      Payload: Buffer.from(JSON.stringify(getCourseDataParams)),
    };

    const courseDataFromWebsite = await invokeLambdaAndGetData(
      getCourseDataInvokeParams
    );

    if (courseDataFromWebsite.error) {
      return {
        statusCode: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: courseDataFromWebsite.error,
      };
    }

    courseData.push({
      department: courseDataFromWebsite.department,
      section: courseDataFromWebsite.section,
      number: courseDataFromWebsite.number,
      session: courseDataFromWebsite.session,
      description: courseDataFromWebsite.description,
    });
  }

  const createTrackingInput = {
    department: department,
    section: section,
    number: number,
    session: session,
    email: email,
    restricted: restricted,
    description: courseData ? courseData[0].description : "",
  };

  const createTrackingResponse: boolean = await createTracking(
    createTrackingInput
  );

  if (createTrackingResponse === false)
    return {
      statusCode: 500,
      headers: { ...CORS_ORIGIN_HEADER },
      body: "An error has occurred while creating the tracking entry in our table.",
    };

  return {
    statusCode: 201,
    headers: { ...CORS_ORIGIN_HEADER },
    body: createTrackingResponse,
  };
};
