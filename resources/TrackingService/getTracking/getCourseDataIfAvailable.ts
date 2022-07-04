import { DynamoDB } from 'aws-sdk';

const TRACKING_TABLE_NAME: string = process.env.TRACKING_TABLE_NAME ? process.env.TRACKING_TABLE_NAME : "";

export const getCourseDataIfAvailable = async (courseName: string) => {
    const db = new DynamoDB.DocumentClient();

    const courseTrackingParams = {
        TableName: TRACKING_TABLE_NAME,
        ExpressionAttributeValues: {
            ":courseName": courseName
        },
        ExpressionAttributeNames: {
            "#dynamo_section": "section",
            "#dynamo_number": "number",
            "#dynamo_session": "session"
        },
        ProjectionExpression: "courseName, includeRestrictedSeats, department, description, #dynamo_section, #dynamo_number, #dynamo_session",
        KeyConditionExpression: "courseName = :courseName"
    }

    const data = await db.query(courseTrackingParams, (error: any, data: any) => {
        if (error) return [error, error.stack];

        return data;
    }).promise();

    const courses = data.Items?.map(course => ({
        department: course.department, 
        description: course.description, 
        section: course.section, 
        number: course.number, 
        session: course.session 
    }));

    return courses;
}
