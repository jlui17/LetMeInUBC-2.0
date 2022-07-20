import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { deleteTracking } from "../../../resources/TrackingService/deleteTracking/DeleteTracking";

const ddbMockClient = mockClient(DynamoDBClient);

const deleteTrackingInput = {
  department: "dep",
  number: "num",
  session: "ses",
  section: "sec",
  email: "ema",
};

beforeEach(() => {
  ddbMockClient.reset();
});

describe("Delete Tracking Endpoint", () => {
  test("deleteTracking helper returns true when ddb client resolves", async () => {
    ddbMockClient.on(DeleteItemCommand).resolvesOnce({});

    const successfullyDeletedTracking = await deleteTracking(
      deleteTrackingInput
    );

    expect(successfullyDeletedTracking).toEqual(true);
  });

  test("deleteTracking helper returns false when ddb client rejects", async () => {
    ddbMockClient.on(DeleteItemCommand).rejectsOnce({});

    const successfullyDeletedTracking = await deleteTracking(
      deleteTrackingInput
    );

    expect(successfullyDeletedTracking).toEqual(false);
  });
});
