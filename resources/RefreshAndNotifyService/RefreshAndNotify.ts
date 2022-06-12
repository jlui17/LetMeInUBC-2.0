import { Lambda } from 'aws-sdk';

const GET_ALL_COURSES: string = process.env.GET_ALL_COURSES || "";
const GET_EMAILS: string = process.env.GET_EMAILS || "";
const GET_AVAILABLE_COURSES: string = process.env.GET_AVAILABLE_COURSES || "";
const NOTIFY_CONTACTS: string = process.env.NOTIFY_CONTACTS || "";
const DELETE_TRACKING: string = process.env.DELETE_TRACKING || "";
const lambda = new Lambda();
let params;
let data;

exports.handler = async (event: any): Promise<any> => {
    params = {
        FunctionName: GET_ALL_COURSES,
        InvocationType: "RequestResponse",
        LogType: "Tail",
    };
    data = await lambda.invoke(params).promise();
    const allCourses = JSON.parse(data.Payload as string);

    params = {
      FunctionName: GET_AVAILABLE_COURSES,
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify({
        sections: allCourses,
      })),
      LogType: "Tail",
    };
    data = await lambda.invoke(params).promise();
    data = JSON.parse(data.Payload as string);
    const availableCourses: Array<string> = data["availableCourses"];
    const invalidCourses = data["invalidCourses"];
    console.log(":: Available Courses: " + JSON.stringify(availableCourses));
    console.log(":: Invalid Courses: " + JSON.stringify(invalidCourses));

    const notifyArr = [];
    for (let course of availableCourses) {
      params = {
        FunctionName: GET_EMAILS,
        InvocationType: "RequestResponse",
        Payload: Buffer.from(JSON.stringify(course)),
        LogType: "Tail",
      };
      data = await lambda.invoke(params).promise();
      const emails = JSON.parse(data.Payload as string);
      notifyArr.push({
        course: course,
        emails: emails,
      });
    }

    console.log(":: Notify Contacts: " + JSON.stringify(notifyArr))
    params = {
      FunctionName: NOTIFY_CONTACTS,
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify({
        data: notifyArr
      })),
      LogType: "Tail",
    };
    data = await lambda.invoke(params).promise();

    console.log(":: Remove Tracking")
    for (let entry of notifyArr) {
      params = {
        FunctionName: DELETE_TRACKING,
        InvocationType: "RequestResponse",
        Payload: Buffer.from(JSON.stringify(entry)),
        LogType: "Tail",
      };
      console.log(":: Tracking removed:" + JSON.stringify(entry))
      data = await lambda.invoke(params).promise();
    }

    // invalid course handling
    for (let invalidDict of invalidCourses) {
      params = {
        FunctionName: GET_EMAILS,
        InvocationType: "RequestResponse",
        Payload: Buffer.from(JSON.stringify(invalidDict['course'])),
        LogType: "Tail",
      };
      data = await lambda.invoke(params).promise();
      const emails = JSON.parse(data.Payload as string);
      for (let email of emails) {
        params = {
          FunctionName: DELETE_TRACKING,
          InvocationType: "RequestResponse",
          Payload: Buffer.from(JSON.stringify({
            email: email,
            course: invalidDict['course'],
          })),
          LogType: "Tail",
        };
        console.log(":: Invalid tracking removed:" +
        JSON.stringify({
          email: email,
          data: invalidDict,
        }))
        data = await lambda.invoke(params).promise();
      }
    }

    return notifyArr;
}
