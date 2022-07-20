import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const TRACKING_TABLE_NAME = process.env.TRACKING_TABLE_NAME || "";

interface courseTrackingParams {
  department: string;
  section: string;
  number: string;
  session: string;
  email: string;
}

export const deleteTracking = async (
  event: courseTrackingParams
): Promise<boolean> => {
  const ddbClient = new DynamoDBClient({});
  const { department, section, number, session, email } = event;
  const courseName = `${session} ${department} ${number} ${section}`;

  const deleteRequest = new DeleteItemCommand({
    TableName: TRACKING_TABLE_NAME,
    Key: { courseName: { S: courseName }, email: { S: email } },
  });

  let response: boolean = true; // using this comment to rebuild lambda

  await ddbClient.send(deleteRequest).catch((error) => {
    response = false;
  });

  return response;
};
