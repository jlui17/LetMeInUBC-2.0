import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

interface createTrackingInput {
  session: string;
  email: string;
  department: string;
  number: string;
  restricted: string;
  section: string;
  description: string;
}

const TRACKING_TABLE_NAME: string = process.env.TRACKING_TABLE_NAME
  ? process.env.TRACKING_TABLE_NAME
  : "";

export const createTracking = async (
  event: createTrackingInput
): Promise<boolean> => {
  const ddbClient = new DynamoDBClient({});
  const {
    department,
    section,
    number,
    session,
    email,
    restricted,
    description,
  } = event;

  const courseName = `${session} ${department} ${number} ${section}`;

  const putRequest = new PutItemCommand({
    TableName: TRACKING_TABLE_NAME,
    Item: {
      courseName: { S: courseName },
      email: { S: email },
      includeRestrictedSeats: { S: restricted },
      department: { S: department },
      section: { S: section },
      number: { S: number },
      session: { S: session },
      description: { S: description },
    },
  });

  let response: boolean = true;

  await ddbClient.send(putRequest).catch((error) => {
    response = false;
  });

  return response;
};
