import { Lambda } from 'aws-sdk';

const invokeLambdaAndGetData = async (params: Lambda.InvocationRequest) => {
    const invokeLambda = (params: Lambda.InvocationRequest) => {
        const lambda = new Lambda();

        return lambda.invoke(params).promise();
    };

    const getDataFromLambdaResponse = (response: any) => {
        return response.Payload;
    }

    const response = await invokeLambda(params);

    return getDataFromLambdaResponse(response);
};
