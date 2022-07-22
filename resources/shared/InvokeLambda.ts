import {
  InvocationResponse,
  InvokeCommand,
  LambdaClient,
} from "@aws-sdk/client-lambda";

const getDataFromLambdaResponse = (response: InvocationResponse): string => {
  return response.Payload?.toString() || "";
};

export const invokeLambdaAndGetData = async (
  invokeRequest: InvokeCommand
): Promise<any> => {
  const lambdaClient = new LambdaClient({});

  const response = await lambdaClient.send(invokeRequest);

  return JSON.parse(getDataFromLambdaResponse(response));
};
