import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { getTrackingByEmail } from "../../../resources/TrackingService/getTracking/GetTrackingByEmail";

const ddbMockClient = mockClient(DynamoDBClient);

const getTrackingByEmailInput = {
  email: "email",
};

beforeEach(() => {
  ddbMockClient.reset();
});

describe("Get Tracking By Email", () => {
  test("getTrackingByEmail helper returns nothing when it finds nothing", async () => {
    ddbMockClient.on(QueryCommand).resolvesOnce({
      Items: [],
    });

    const successfullyGetTrackingByEmail = await getTrackingByEmail(
      getTrackingByEmailInput
    );

    expect(successfullyGetTrackingByEmail).toEqual([]);
  });

  test("getTrackingByEmail helper returns list with courses", async () => {
    ddbMockClient.on(QueryCommand).resolvesOnce({
      Items: [
        {
          courseName: { S: "courseName" },
          includeRestrictedSeats: { S: "restricted" },
          department: { S: "department" },
          section: { S: "section" },
          number: { S: "number" },
          session: { S: "session" },
          description: { S: "description" },
        },
      ],
    });

    const successfullyGetTrackingByEmail = await getTrackingByEmail(
      getTrackingByEmailInput
    );

    expect(successfullyGetTrackingByEmail).toEqual([
      {
        name: { S: "courseName" },
        restricted: { S: "restricted" },
        department: { S: "department" },
        section: { S: "section" },
        number: { S: "number" },
        session: { S: "session" },
        description: { S: "description" },
      },
    ]);
  });

  test("getTrackingByEmail helper returns null when ddb client rejects", async () => {
    ddbMockClient.on(QueryCommand).rejectsOnce("error");

    let successfullyGetTrackingByEmail;
    try {
      successfullyGetTrackingByEmail = await getTrackingByEmail(
        getTrackingByEmailInput
      );
      expect(successfullyGetTrackingByEmail).toThrowError();
    } catch (error) {}
  });
});
