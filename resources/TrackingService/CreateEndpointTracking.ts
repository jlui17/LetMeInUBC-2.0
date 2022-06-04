import { DynamoDB } from 'aws-sdk';

const TRACKING_TABLE_NAME: string = process.env.TRACKING_TABLE_NAME ? process.env.TRACKING_TABLE_NAME : "";

exports.handler = async (event: any): Promise<any> => {
  const db = new DynamoDB.DocumentClient();
  const { department, section, number, session, email } = JSON.parse(event.body);
  const courseName = `${session} ${department} ${number} ${section}`

  await db.put({
    TableName: TRACKING_TABLE_NAME,
    Item: {
      courseName: courseName,
      email: email
    },
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(`${email} is now tracking ${courseName}!`)
  }
}
