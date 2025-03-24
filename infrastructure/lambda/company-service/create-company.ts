import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Company } from '../../lib/models/Company';
import { buildResponse } from '../../lib/utils/response-builder';
import { AppError, handleError } from '../../lib/utils/error-handler';
import { logger } from  '../../lib/utils/logger';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.COMPANY_TABLE;
if (!tableName) {
  throw new Error("COMPANY_TABLE environment variable is not defined");
}


export const handler = async (event: APIGatewayProxyEvent, aPIGatewayProxyResult: APIGatewayProxyResult ): Promise<APIGatewayProxyResult> => {
  try {
    //logger.info('Request received to create a company', { event });

    console.log(`Request received to create a company`)
  

    // Parse the request body
    const body = JSON.parse(event.body || '{}');
    const company: Company = body;

    // Validate the input
    if (!company.name) {
      return buildResponse(400, { message: 'Company name is required' });
    }

    // Generate a unique company ID
    const companyId = uuidv4();

    // Prepare the DynamoDB item
    const params = {
      TableName: tableName,
      Item: {
        companyId,
        name: company.name,
        createdAt: new Date().toISOString(),
      },
    };

    // Save the company to DynamoDB
    await dynamoDb.put(params).promise();

   // logger.info('Company created successfully', { companyId });
    console.log(`Company created successfully, companyId: ${companyId}`)
    

    // Return the response
    return buildResponse(201, {
      message: 'Company created successfully',
      companyId,
    });
  } catch (error: any) {
    return handleError(error);

  }
};