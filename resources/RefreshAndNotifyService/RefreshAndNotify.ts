import { Lambda } from 'aws-sdk';

const GET_TRACKING: string = process.env.GET_TRACKING || "";
const GET_AVAILABLE_COURSES: string = process.env.GET_AVAILABLE_COURSES || "";
const NOTIFY_CONTACTS: string = process.env.NOTIFY_CONTACTS || "";
const lambda = new Lambda();
let params;
let data;

exports.handler = async (event: any): Promise<any> => {
    params = {
        FunctionName: GET_TRACKING,
        InvocationType: "RequestResponse",
        Payload: Buffer.from(JSON.stringify({ queryStringParameters: {
          key: "allCourses",
        }})),
        LogType: "Tail",
    };
    data = await lambda.invoke(params).promise();
    const allCourses = JSON.parse(JSON.parse(data.Payload as string)["body"])["courses"]

    params = {
      FunctionName: GET_AVAILABLE_COURSES,
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify({
        sections: allCourses,
      })),
      LogType: "Tail",
    };
    data = await lambda.invoke(params).promise();
    data = JSON.parse(JSON.parse(data.Payload as string)["body"]);
    const availableCourses = data["availableCourses"];
    const invalidCourses = data["invalidCourses"];

    const notifyArr = [];
    for (let course of availableCourses) {
      course["key"] = "courseName";
      params = {
        FunctionName: GET_TRACKING,
        InvocationType: "RequestResponse",
        Payload: Buffer.from(JSON.stringify({ queryStringParameters:
          course
        })),
        LogType: "Tail",
      };
      data = await lambda.invoke(params).promise();
      const emails = JSON.parse(JSON.parse(data.Payload as string)["body"])["emails"];
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
