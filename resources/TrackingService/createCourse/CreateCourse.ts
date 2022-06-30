import { DynamoDB } from 'aws-sdk';

const COURSES_TABLE_NAME: string = process.env.COURSES_TABLE_NAME ? process.env.COURSES_TABLE_NAME : "";

export const createCourse = async (courseParams: {
    department: string,
    session: string,
    number: string,
    section: string,
    title: string,
    description: string,
}): Promise<boolean> => {
    const db = new DynamoDB.DocumentClient();
    const { department, section, number, session, title, description } = courseParams;
    const courseName = `${session} ${department} ${number} ${section}`

    let success: boolean = true;

    await db.put({
        TableName: COURSES_TABLE_NAME,
        Item: {
            department: department,
            session: session,
            number: number,
            section: section,
            title: title,
            description: description,
            courseName: courseName,
        },
    }).promise().catch(error => { success = false });

    return success;
}
