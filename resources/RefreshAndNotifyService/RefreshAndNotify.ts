import { Lambda } from 'aws-sdk';
import { stringify } from 'querystring';

const GET_ALL_COURSES: string = process.env.GET_ALL_COURSES || "";
const GET_EMAILS: string = process.env.GET_EMAILS || "";
const GET_AVAILABLE_COURSES: string = process.env.GET_AVAILABLE_COURSES || "";
const NOTIFY_CONTACTS: string = process.env.NOTIFY_CONTACTS || "";
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

    params = {
      FunctionName: NOTIFY_CONTACTS,
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify({
        data: notifyArr
      })),
      LogType: "Tail",
    };
    data = await lambda.invoke(params).promise();
    console.log(data);

    return {
        status: 200,
        body: JSON.stringify('Success'),
    };
}
