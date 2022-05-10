import { DynamoDB } from 'aws-sdk';

const TRACKING_TABLE_NAME: string = process.env.TRACKING_TABLE_NAME ? process.env.TRACKING_TABLE_NAME : "";
const EMAIL_INDEX_NAME: string = process.env.EMAIL_INDEX_NAME ? process.env.EMAIL_INDEX_NAME : "";

exports.handler = async (event: any): Promise<any> => {
  const db = new DynamoDB.DocumentClient();

  const { key } = event.queryStringParameters;
  let courseTrackingParams;
  let data;

  switch (key) {
    // get by course
    case 'courseName':
      const { department, section, number, session } = event.queryStringParameters;
      const courseName = `${session} ${department} ${number} ${section}`
    
      courseTrackingParams = {
        TableName: TRACKING_TABLE_NAME,
        ExpressionAttributeValues: {
          ":courseName": courseName
        },
        ProjectionExpression: "email",
        KeyConditionExpression: "courseName = :courseName"
      }
      data = await db.query(courseTrackingParams, (error: any, data: any) => {
        if (error) return [error, error.stack];
    
        console.log(data);
        return data;
      }).promise();
    
      return {
        statusCode: 200,
        body: JSON.stringify(data.Items)
      };
    
    // get by email
    case 'email':
      const { email } = event.queryStringParameters;
    
      courseTrackingParams = {
        TableName: TRACKING_TABLE_NAME,
        IndexName: EMAIL_INDEX_NAME,
        ExpressionAttributeValues: {
          ":email": email
        },
        ProjectionExpression: "courseName",
        KeyConditionExpression: "email = :email"
      }
      data = await db.query(courseTrackingParams, (error: any, data: any) => {
        if (error) return [error, error.stack];
    
        console.log(data);
        return data;
      }).promise();
    
      return {
        statusCode: 200,
        body: JSON.stringify(data.Items)
      };
    
    // bad request, must specify key to query by
    default:
      return {
        statusCode: 400,
      };
  }
}
