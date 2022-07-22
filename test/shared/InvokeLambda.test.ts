import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { invokeLambdaAndGetData } from "../../resources/shared/InvokeLambda";

const lambdaClientMock = mockClient(LambdaClient);

beforeEach(() => {
  lambdaClientMock.reset();
});

describe("Shared invokeLambdaAndGetData function", () => {
  test("calls client with the right parameters and returns a JSON", async () => {
    lambdaClientMock
      .on(InvokeCommand, {
        FunctionName: "function",
        Payload: Buffer.from("payload"),
      })
      .resolvesOnce({
        Payload: Buffer.from(JSON.stringify({ response: "correct" })),
      });

    const invokeLambdaAndGetDataResponse = await invokeLambdaAndGetData(
      new InvokeCommand({
        FunctionName: "function",
        Payload: Buffer.from("payload"),
      })
    );

    expect(invokeLambdaAndGetDataResponse.response).toEqual("correct");
  });

  test("calls client with the right parameters and returns a string", async () => {
    lambdaClientMock
      .on(InvokeCommand, {
        FunctionName: "function",
        Payload: Buffer.from("payload"),
      })
      .resolvesOnce({
        Payload: Buffer.from("correct"),
      });

    const invokeLambdaAndGetDataResponse = await invokeLambdaAndGetData(
      new InvokeCommand({
        FunctionName: "function",
        Payload: Buffer.from("payload"),
      })
    );

    expect(invokeLambdaAndGetDataResponse).toEqual("correct");
  });

  test("calls client with the wrong parameters and returns error", async () => {
    lambdaClientMock.on(InvokeCommand).rejectsOnce("error");

    const invokeLambdaAndGetDataResponse = await invokeLambdaAndGetData(
      new InvokeCommand({
        FunctionName: "function",
        Payload: Buffer.from("payload"),
      })
    );

    expect(invokeLambdaAndGetDataResponse).toEqual(new Error("error"));
  });
});
