import { DynamoDB } from 'aws-sdk';

const TRACKING_TABLE_NAME: string = process.env.TRACKING_TABLE_NAME ? process.env.TRACKING_TABLE_NAME : "";

exports.handler = async (): Promise<any> => {
    const db = new DynamoDB.DocumentClient();

    const courseTrackingParams = {
        TableName: TRACKING_TABLE_NAME,
        ProjectionExpression: "courseName",
    }

    const data = await db.scan(courseTrackingParams, (error: any, data: any) => {
        if (error) return [error, error.stack];

        return data;
    }).promise();

    const allCourses = data.Items?.map(course => course.courseName);

    return allCourses;
}
