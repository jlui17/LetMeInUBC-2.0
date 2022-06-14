import { DynamoDB } from 'aws-sdk';

const TRACKING_TABLE_NAME: string = process.env.TRACKING_TABLE_NAME ? process.env.TRACKING_TABLE_NAME : "";
const COURSE_INDEX_NAME: string = process.env.COURSE_INDEX_NAME ? process.env.COURSE_INDEX_NAME : "";

interface GetTrackingByCourseParams {
    department: string,
    section: string,
    number: string,
    session: string,
    restricted: boolean,
}

exports.handler = async (event: GetTrackingByCourseParams): Promise<any> => {
    const db = new DynamoDB.DocumentClient();
    const { department, section, number, session, restricted } = event;
    const courseName = `${session} ${department} ${number} ${section}`

    const courseTrackingParams = {
        TableName: TRACKING_TABLE_NAME,
        IndexName: COURSE_INDEX_NAME,
        ExpressionAttributeValues: {
            ":courseName": courseName,
            ":restricted": restricted,
        },
        ProjectionExpression: "email",
        KeyConditionExpression: 'courseName = :courseName AND includeRestrictedSeats = :restricted'
    };

    const data = await db.query(courseTrackingParams, (error: any, data: any) => {
        if (error) return [error, error.stack];

        return data;
    }).promise();

    const emails = data.Items?.map(email => email.email);
    console.log(emails);

    return emails;
}
