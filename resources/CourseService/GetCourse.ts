import { DynamoDB } from 'aws-sdk';

const COURSES_TABLE_NAME: string = process.env.COURSES_TABLE_NAME ? process.env.COURSES_TABLE_NAME : "";

exports.handler = async (event: {
    department: string,
    section: string,
    number: string,
    session: string,
}): Promise<any> => {
    const db = new DynamoDB.DocumentClient();
    const { department, section, number, session } = event;
    const courseName: string = `${session} ${department} ${number} ${section}`

    const courseParams = {
        TableName: COURSES_TABLE_NAME,
        Key: {
            courseName: courseName
        },
        AttributesToGet: ["title", "description"],
    };

    const data = await db.get(courseParams, (error: any, data: any) => {
        if (error) return [error, error.stack];

        console.log(data);
        return data;
    }).promise();

    // if course not found in table
    if (!data.Item) {};

    return data.Item;
}
