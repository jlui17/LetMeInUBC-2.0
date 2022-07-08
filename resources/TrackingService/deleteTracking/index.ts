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
  const courseName = `${session} ${department} ${number} ${section}`;

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
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "Error deleting tracking entry from table",
    };

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: response,
  };
};

export default exports.handler;
