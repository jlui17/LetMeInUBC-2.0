import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

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
  const db = new DynamoDBClient({});
  const { department, section, number, session, email } = event;
  const courseName = `${session} ${department} ${number} ${section}`;

  let response: boolean = true;

  await db
    .send(
      new DeleteItemCommand({
        TableName: TRACKING_TABLE_NAME,
        Key: {
          courseName: { S: courseName },
          email: { S: email },
        },
      })
    )
    .catch((error) => {
      response = false;
    });

  return response;
};

exports.handler = deleteTracking;
