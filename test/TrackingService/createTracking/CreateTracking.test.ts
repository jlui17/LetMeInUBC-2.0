import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { createTracking } from "../../../resources/TrackingService/createTracking/CreateTracking";

const ddbMockClient = mockClient(DynamoDBClient);

const createTrackingInput = {
  department: "dep",
  number: "num",
  session: "ses",
  section: "sec",
  email: "ema",
  restricted: "res",
  description: "des",
};

beforeEach(() => {
  ddbMockClient.reset();
});

describe("Create Tracking Endpoint", () => {
  test("createTracking helper returns true when ddb client resolves", async () => {
    ddbMockClient.on(PutItemCommand).resolvesOnce({});

    const successfullyDeletedTracking = await createTracking(
      createTrackingInput
    );

    expect(successfullyDeletedTracking).toEqual(true);
  });

  test("deleteTracking helper returns false when ddb client rejects", async () => {
    ddbMockClient.on(PutItemCommand).rejectsOnce({});

    const successfullyDeletedTracking = await createTracking(
      createTrackingInput
    );

    expect(successfullyDeletedTracking).toEqual(false);
  });
});
