import { CORS_ORIGIN_HEADER } from "../../shared/Constants";
import { getTrackingByAllCourses } from "./GetTrackingByAllCourses";
import { getTrackingByCourse } from "./GetTrackingByCourse";
import { getTrackingByEmail } from "./GetTrackingByEmail";

exports.handler = async (event: any): Promise<any> => {
  const { key } = event.queryStringParameters;

  switch (key) {
    case "courseName":
      const { department, section, number, session, restricted } =
        event.queryStringParameters;

      const getTrackingByCourseInput = {
        department: department,
        section: section,
        number: number,
        session: session,
        restricted: restricted,
      };

      const emails: string[] = await getTrackingByCourse(
        getTrackingByCourseInput
      );

      if (emails.length === 0)
        return {
          statusCode: 404,
          headers: { ...CORS_ORIGIN_HEADER },
        };

      return {
        statusCode: 200,
        headers: { ...CORS_ORIGIN_HEADER },
        body: JSON.stringify(emails),
      };

    case "email":
      const { email } = event.queryStringParameters;

      const getTrackingByEmailInput = { email: email };

      let hasErrored = false;
      const courses: string[] = await getTrackingByEmail(
        getTrackingByEmailInput
      ).catch((error) => {
        hasErrored = true;
        return error;
      });
      if (hasErrored) return courses;

      if (courses.length === 0)
        return {
          statusCode: 200,
          headers: { ...CORS_ORIGIN_HEADER },
          body: JSON.stringify(courses),
        };

      return {
        statusCode: 200,
        headers: {
          ...CORS_ORIGIN_HEADER,
        },
        body: JSON.stringify(courses),
      };

    case "allCourses":
      const allCourses: string[] = await getTrackingByAllCourses();

      if (allCourses.length === 0)
        return {
          statusCode: 404,
          headers: {
            ...CORS_ORIGIN_HEADER,
          },
        };

      return {
        statusCode: 200,
        headers: {
          ...CORS_ORIGIN_HEADER,
        },
        body: JSON.stringify(allCourses),
      };

    default:
      return {
        statusCode: 400,
        headers: {
          ...CORS_ORIGIN_HEADER,
        },
        body: "Your key should be one of 'courseName', 'email', or 'allCourses'.",
      };
  }
};
