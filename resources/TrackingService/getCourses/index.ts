import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { getCourses } from "./GetCourses";

exports.handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const courseInput: string = event.queryStringParameters?.courses?.toString() || '';
    
    if (courseInput === '') 
        return {
            headers: { "Access-Control-Allow-Origin": "*" },
            statusCode: 400,
            body: ''
        }

    const coursesToFetch: string[] = courseInput!.split(",");

    const fetchedCourses: AttributeMap[] = await getCourses(coursesToFetch);

    return {
        statusCode: 201,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(fetchedCourses),
    }
};

export default getCourses;
