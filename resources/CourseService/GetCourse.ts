import { DynamoDB } from 'aws-sdk';

const COURSES_TABLE_NAME: string = process.env.COURSES_TABLE_NAME ? process.env.COURSES_TABLE_NAME : "";

exports.handler = async (event: any): Promise<any> => {
  const db = new DynamoDB.DocumentClient();
  const { department, section, number, session } = event.queryStringParameters;
  const courseName: string = `${session} ${department} ${number} ${section}`

  const courseParams = {
    TableName: COURSES_TABLE_NAME,
    Key: {
      courseName: courseName
    },
  }
  const data = await db.get(courseParams, (error, data) => {
    if (error) return [error, error.stack];

    console.log(data);
    return data;
  }).promise();

  // if course not found in table
  if (!data.Item) return {
    statusCode: 404
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data.Item)
  };
}
