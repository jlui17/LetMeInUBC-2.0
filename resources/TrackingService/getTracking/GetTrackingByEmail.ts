import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const TRACKING_TABLE_NAME: string = process.env.TRACKING_TABLE_NAME
  ? process.env.TRACKING_TABLE_NAME
  : "";
const EMAIL_INDEX_NAME: string = process.env.EMAIL_INDEX_NAME
  ? process.env.EMAIL_INDEX_NAME
  : "";

interface GetTrackingByEmailParams {
  email: string;
}

export const getTrackingByEmail = async (
  event: GetTrackingByEmailParams
): Promise<any> => {
  const ddbClient = new DynamoDBClient({});
  const { email } = event;

  const getRequest = new QueryCommand({
    TableName: TRACKING_TABLE_NAME,
    IndexName: EMAIL_INDEX_NAME,
    ExpressionAttributeValues: {
      ":email": { S: email },
    },
    ExpressionAttributeNames: {
      "#dynamo_section": "section",
      "#dynamo_number": "number",
      "#dynamo_session": "session",
    },
    ProjectionExpression:
      "courseName, includeRestrictedSeats, department, description, #dynamo_section, #dynamo_number, #dynamo_session",
    KeyConditionExpression: "email = :email",
  });

  let ddbError = null;
  const data = await ddbClient.send(getRequest).catch((error) => {
    ddbError = error;
  });

  if (ddbError !== null) throw ddbError;

  const courses = data?.Items?.map((course) => ({
    name: course.courseName,
    restricted: course.includeRestrictedSeats,
    department: course.department,
    description: course.description,
    section: course.section,
    number: course.number,
    session: course.session,
  }));

  return courses;
};
