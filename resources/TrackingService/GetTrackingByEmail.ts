import { DynamoDB } from 'aws-sdk';

const TRACKING_TABLE_NAME: string = process.env.TRACKING_TABLE_NAME ? process.env.TRACKING_TABLE_NAME : "";
const EMAIL_INDEX_NAME: string = process.env.EMAIL_INDEX_NAME ? process.env.EMAIL_INDEX_NAME : "";

interface GetTrackingByEmailParams {
    email: string
}

exports.handler = async (event: GetTrackingByEmailParams): Promise<any> => {
    const db = new DynamoDB.DocumentClient();
    const { email } = event;

    const courseTrackingParams = {
    TableName: TRACKING_TABLE_NAME,
    IndexName: EMAIL_INDEX_NAME,
    ExpressionAttributeValues: {
        ":email": email
    },
    ProjectionExpression: "courseName",
    KeyConditionExpression: "email = :email"
    }

    const data = await db.query(courseTrackingParams, (error: any, data: any) => {
    if (error) return [error, error.stack];

    return data;
    }).promise();

    const courses = data.Items?.map(course => course.courseName);

    return courses;
}
