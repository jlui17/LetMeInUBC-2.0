import { DynamoDB } from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';

const COURSES_TABLE_NAME: string = process.env.COURSES_TABLE_NAME ? process.env.COURSES_TABLE_NAME : "";

export const getCourses = async (courses: string[] ): Promise<AttributeMap[]> => {
    const db = new DynamoDB.DocumentClient();
    const courseNames = courses;

    const fetchedCourses: AttributeMap[] = [];

    for (let i = 0; i < courseNames.length; i++) {
        const courseParams = {
            TableName: COURSES_TABLE_NAME,
            Key: {
                courseName: courseNames[i]
            },
            AttributesToGet: ["session", "department", "number", "section", "title", "description"],
        };
    
        const data = await db.get(courseParams, (error: any, data: any) => {
            if (error) return [error, error.stack];
    
            console.log(data);
            return data;
        }).promise();

        if (data.Item) fetchedCourses.push(data.Item);
    }

    return fetchedCourses;
}
