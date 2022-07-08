import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { deleteTracking } from "../../../resources/TrackingService/deleteTracking/DeleteTracking";

const ddbMockClient = mockClient(DynamoDBClient);

beforeEach(() => {
  ddbMockClient.reset();
});

test("Delete tracking endpoint calls delete tracking helper", async () => {
  const deleteTrackingInput = {
    department: "dep",
    number: "num",
    session: "ses",
    section: "sec",
    email: "ema",
  };

  ddbMockClient.on(DeleteItemCommand).resolves({});

  const successfullyDeletedTracking = await deleteTracking(deleteTrackingInput);

  expect(successfullyDeletedTracking).toEqual(true);
});
