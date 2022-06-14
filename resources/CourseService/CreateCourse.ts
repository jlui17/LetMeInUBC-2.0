import { DynamoDB } from 'aws-sdk';

const COURSES_TABLE_NAME: string = process.env.COURSES_TABLE_NAME ? process.env.COURSES_TABLE_NAME : "";

interface courseParams {
    department: string,
    session: string,
    number: string,
    section: string,
    title: string,
    description: string,
}

exports.handler = async (event: courseParams): Promise<string> => {
    const db = new DynamoDB.DocumentClient();
    const { department, section, number, session, title, description } = event;

    await db.put({
        TableName: COURSES_TABLE_NAME,
        Item: {
            department: department,
            session: session,
            number: number,
            section: section,
            title: title,
            description: description,
        },
    }).promise();

    return `Added ${session}:${department} ${number} ${section} ${title} ${description} to Courses table!`;
}
