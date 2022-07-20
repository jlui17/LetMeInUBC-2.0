import { CORS_ORIGIN_HEADER } from "../../shared/Constants";
import { deleteTracking } from "./DeleteTracking";

interface courseParams {
  department: string;
  section: string;
  number: string;
  session: string;
  email: string;
}

exports.handler = async (event: any): Promise<any> => {
  const { department, section, number, session, email } = JSON.parse(
    event.body
  );

  const deleteCourseInput: courseParams = {
    department: department,
    section: section,
    number: number,
    session: session,
    email: email,
  };

  const response: boolean = await deleteTracking(deleteCourseInput);

  if (response === false)
    return {
      statusCode: 500,
      headers: { ...CORS_ORIGIN_HEADER },
      body: "Error deleting tracking entry from table",
    };

  return {
    statusCode: 200,
    headers: { ...CORS_ORIGIN_HEADER },
    body: response,
  };
};
