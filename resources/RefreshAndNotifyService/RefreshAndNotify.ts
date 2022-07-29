import { Lambda } from "aws-sdk";

const GET_ALL_COURSES: string = process.env.GET_ALL_COURSES || "";
const GET_EMAILS: string = process.env.GET_EMAILS || "";
const GET_AVAILABLE_COURSES: string = process.env.GET_AVAILABLE_COURSES || "";
const NOTIFY_CONTACTS: string = process.env.NOTIFY_CONTACTS || "";
const DELETE_TRACKING: string = process.env.DELETE_TRACKING || "";
const lambda = new Lambda();
let params;
let response;
interface CourseEntry {
  session: string;
  department: string;
  number: string;
  section: string;
  title?: string;
  description?: string;
  email?: string;
  restricted?: string;
}

exports.handler = async (event: any): Promise<any> => {
  // get all tracking then get available courses from it
  params = {
    FunctionName: GET_ALL_COURSES,
    InvocationType: "RequestResponse",
    LogType: "Tail",
  };
  response = await lambda.invoke(params).promise();
  const allCourses: string[] = JSON.parse(response.Payload as string);

  params = {
    FunctionName: GET_AVAILABLE_COURSES,
    InvocationType: "RequestResponse",
    Payload: JSON.stringify({
      sections: allCourses,
    }),
    LogType: "Tail",
  };
  response = await lambda.invoke(params).promise();
  response = JSON.parse(response.Payload as string);
  const availableCourses: Array<CourseEntry> = response["availableCourses"];
  const invalidCourses: Array<{ course: CourseEntry; reason: string }> =
    response["invalidCourses"];
  const refreshFailedCourses: Array<CourseEntry> =
    response["refreshFailedCourses"];
  if (availableCourses.length > 0) {
    console.log(":: Available Courses: " + JSON.stringify(availableCourses));
  }
  if (invalidCourses.length > 0) {
    console.log(":: Invalid Courses: " + JSON.stringify(invalidCourses));
  }
  if (refreshFailedCourses.length > 0) {
    console.log(
      ":: Refresh Failed Courses: " + JSON.stringify(refreshFailedCourses)
    );
  }

  const notifyArr: Array<{ course: CourseEntry; emails: Array<string> }> = [];
  for (let course of availableCourses) {
    params = {
      FunctionName: GET_EMAILS,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(course),
      LogType: "Tail",
    };
    response = await lambda.invoke(params).promise();
    const emails: Array<string> = JSON.parse(response.Payload as string);
    if (emails.length) {
      notifyArr.push({
        course: course,
        emails,
      });
    }
  }

  // notify then remove tracking
  if (notifyArr.length > 0) {
    console.log(":: Notify Contacts: " + JSON.stringify(notifyArr));
    params = {
      FunctionName: NOTIFY_CONTACTS,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        data: notifyArr,
      }),
      LogType: "Tail",
    };
    response = await lambda.invoke(params).promise();

    console.log(":: Remove Tracking");
    for (let entry of notifyArr) {
      for (let email of entry["emails"]) {
        const queryParams = entry["course"];
        queryParams["email"] = email;
        params = {
          FunctionName: DELETE_TRACKING,
          InvocationType: "RequestResponse",
          Payload: JSON.stringify(queryParams),
          LogType: "Tail",
        };
        console.log(":: Tracking removed:" + JSON.stringify(queryParams));
        response = await lambda.invoke(params).promise();
      }
    }
  }

  // invalid course handling
  for (let invalidDict of invalidCourses) {
    const queryParams = invalidDict["course"];
    queryParams["restricted"] = "false";
    params = {
      FunctionName: GET_EMAILS,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(queryParams),
      LogType: "Tail",
    };
    response = await lambda.invoke(params).promise();

    const emails = JSON.parse(response.Payload as string);
    for (let email of emails) {
      const queryParams = invalidDict["course"];
      queryParams["email"] = email;
      params = {
        FunctionName: DELETE_TRACKING,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify(queryParams),
        LogType: "Tail",
      };
      console.log(":: Invalid tracking removed:" + JSON.stringify(queryParams));
      response = await lambda.invoke(params).promise();
    }
  }

  return notifyArr;
};
