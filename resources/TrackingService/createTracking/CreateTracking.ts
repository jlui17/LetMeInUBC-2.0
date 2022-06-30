import { DynamoDB } from 'aws-sdk';

interface createTrackingInput {
    session: string,
    email: string,
    department: string,
    number: string,
    restricted: string,
    section: string
}

const TRACKING_TABLE_NAME: string = process.env.TRACKING_TABLE_NAME ? process.env.TRACKING_TABLE_NAME : "";

export const createTracking = async (event: createTrackingInput): Promise<boolean> => {
    const db = new DynamoDB.DocumentClient();
    const { department, section, number, session, email, restricted } = event;
    const courseName = `${session} ${department} ${number} ${section}`

    let response: boolean = true;

    await db.put({
        TableName: TRACKING_TABLE_NAME,
        Item: {
            courseName: courseName,
            email: email,
            includeRestrictedSeats: restricted,
        },
    }).promise().catch(error => { response = false });

    return response;
}
