import { DynamoDB } from 'aws-sdk';

const TRACKING_TABLE_NAME: string = process.env.TRACKING_TABLE_NAME ? process.env.TRACKING_TABLE_NAME : "";

interface courseTrackingParams {
    department: string,
    section: string,
    number: string,
    session: string,
    email: string,
}

exports.handler = async (event: courseTrackingParams): Promise<string> => {
  const db = new DynamoDB.DocumentClient();
  const { department, section, number, session, email } = event;
  const courseName = `${session} ${department} ${number} ${section}`

  await db.delete({
    TableName: TRACKING_TABLE_NAME,
    Key: {
      courseName: courseName,
      email: email
    },
  }).promise();

  return `${email} is not tracking ${courseName} anymore!`;
}
