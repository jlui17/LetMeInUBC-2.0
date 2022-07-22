import { InvokeCommand } from "@aws-sdk/client-lambda";
import { CORS_ORIGIN_HEADER } from "../../shared/Constants";
import { invokeLambdaAndGetData } from "../../shared/InvokeLambda";
import { getCourseDataIfAvailable } from "../getTracking/getCourseDataIfAvailable";
import { createTracking } from "./CreateTracking";

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

    const getCourseDataRequest: InvokeCommand = new InvokeCommand({
      FunctionName: GET_COURSE_DATA_FUNCTION_NAME,
      Payload: Buffer.from(JSON.stringify(getCourseDataParams)),
    });

    const courseDataFromWebsite = await invokeLambdaAndGetData(
      getCourseDataRequest
    );

    if (courseDataFromWebsite instanceof Error) {
      return {
        statusCode: 500,
        headers: { ...CORS_ORIGIN_HEADER },
        body: courseDataFromWebsite,
      };
    }

    if (courseDataFromWebsite.error) {
      return {
        statusCode: 404,
        headers: { ...CORS_ORIGIN_HEADER },
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
