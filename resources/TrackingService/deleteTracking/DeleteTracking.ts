import { DynamoDB } from "aws-sdk";

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
  const db = new DynamoDB.DocumentClient();
  const { department, section, number, session, email } = event;
  const courseName = `${session} ${department} ${number} ${section}`;

  let response: boolean = true; // using this comment to rebuild lambda

  await db
    .delete({
      TableName: TRACKING_TABLE_NAME,
      Key: {
        courseName: courseName,
        email: email,
      },
    })
    .promise()
    .catch((error) => {
      response = false;
    });

  return response;
};

exports.handler = deleteTracking;
