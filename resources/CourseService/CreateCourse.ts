import { DynamoDB } from 'aws-sdk';

const COURSES_TABLE_NAME: string = process.env.COURSES_TABLE_NAME ? process.env.COURSES_TABLE_NAME : "";

exports.handler = async (event: any): Promise<any> => {
  const db = new DynamoDB.DocumentClient();
  const { department, section, number, session } = JSON.parse(event.body);
  const courseName = `${session} ${department} ${number} ${section}`

  await db.put({
    TableName: COURSES_TABLE_NAME,
    Item: {
      courseName: courseName
    },
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(`Added ${courseName}!`)
  }
}
