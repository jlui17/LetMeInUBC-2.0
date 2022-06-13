import { DynamoDB } from 'aws-sdk';

interface createTrackingParams {
    session: string,
    email: string,
    department: string,
    number: string,
    restricted: string,
    section: string
}

const TRACKING_TABLE_NAME: string = process.env.TRACKING_TABLE_NAME ? process.env.TRACKING_TABLE_NAME : "";

exports.handler = async (event: createTrackingParams): Promise<any> => {
    const db = new DynamoDB.DocumentClient();
    const { department, section, number, session, email, restricted } = event;
    const courseName = `${session} ${department} ${number} ${section}`

    await db.put({
        TableName: TRACKING_TABLE_NAME,
        Item: {
            courseName: courseName,
            email: email,
            includeRestrictedSeats: restricted === 'true',
        },
    }).promise();

    return `${email} is now tracking ${restricted === 'true' ? 'restricted' : 'general'} seating for ${courseName}`;
}
