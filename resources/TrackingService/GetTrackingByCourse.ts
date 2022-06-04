import { DynamoDB } from 'aws-sdk';

const TRACKING_TABLE_NAME: string = process.env.TRACKING_TABLE_NAME ? process.env.TRACKING_TABLE_NAME : "";

interface GetTrackingByCourseParams {
    department: string,
    section: string,
    number: string,
    session: string,
}

exports.handler = async (event: GetTrackingByCourseParams): Promise<any> => {
    const db = new DynamoDB.DocumentClient();
    const { department, section, number, session } = event;
    const courseName = `${session} ${department} ${number} ${section}`

    const courseTrackingParams = {
        TableName: TRACKING_TABLE_NAME,
        ExpressionAttributeValues: {
            ":courseName": courseName
        },
        ProjectionExpression: "email",
        KeyConditionExpression: "courseName = :courseName"
    };

    const data = await db.query(courseTrackingParams, (error: any, data: any) => {
        if (error) return [error, error.stack];

        return data;
    }).promise();

    const emails = data.Items?.map(email => email.email);
    console.log(emails);

    return emails;
}
