import {
  InvocationResponse,
  InvokeCommand,
  LambdaClient,
} from "@aws-sdk/client-lambda";

const getDataFromLambdaResponse = (response: InvocationResponse): string => {
  const payloadAsString = response.Payload?.toString() || "";
  const isJson = payloadAsString.length > 0 && payloadAsString[0] === "{";
  if (isJson) return JSON.parse(payloadAsString);

  return payloadAsString;
};

export const invokeLambdaAndGetData = async (
  invokeRequest: InvokeCommand
): Promise<any> => {
  const lambdaClient = new LambdaClient({});

  try {
    const response = await lambdaClient.send(invokeRequest);

    return getDataFromLambdaResponse(response);
  } catch (error) {
    return error;
  }
};
