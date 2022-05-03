const { DynamoDB } = require('aws-sdk');

exports.handler = async (event: any): Promise<any> => {
  if (event.httpMethod !== 'POST') return {
    statusCode: 400,
    body: JSON.stringify(`Please send a POST request. (${event.httpMethod})`)
  };

  const db = new DynamoDB.DocumentClient();
  const { department, section, number, session } = JSON.parse(event.body);
  const courseName = `${session} ${department} ${number} ${section}`

  await db.put({
    TableName: process.env.COURSES_TABLE_NAME,
    Item: {
      courseName: courseName
    },
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(`Added ${courseName}!`)
  }
}
