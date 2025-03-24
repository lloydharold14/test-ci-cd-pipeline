import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, Billing, TableV2 } from 'aws-cdk-lib/aws-dynamodb';

interface CompanyServiceStackProps extends StackProps {
    DEPLOY_ENVIRONMENT: string;}

export class CompanyServiceStack extends Stack {


  constructor(scope: Construct, id: string, props: CompanyServiceStackProps) {
    super(scope, id, props);

    const companyTable = new TableV2(
        this,
        "CompanyTableConstruct", // Unique ID for the company table
        {
          partitionKey: {
            name: "companyId",
            type: AttributeType.STRING,
          },
          sortKey: {
            name: "timestamp",
            type: AttributeType.NUMBER,
          },
          tableName: "CompanyTable",
          billing: Billing.onDemand(),
          removalPolicy: RemovalPolicy.DESTROY,
        }
      );
      
      const doctorCompanyTable = new TableV2(
        this,
        "DoctorCompanyTableConstruct", // Unique ID for the doctor-company table
        {
          partitionKey: {
            name: "doctorId",
            type: AttributeType.STRING,
          },
          sortKey: {
            name: "companyId",
            type: AttributeType.STRING,
          },
          tableName: "DoctorCompanyTable",
          billing: Billing.onDemand(),
          removalPolicy: RemovalPolicy.DESTROY,
        }
      );
      

    // Lambda Functions
    const createCompanyLambda = new NodejsFunction(this, 'CreateCompanyLambda', {
        entry: 'lambda/company-service/create-company.ts',
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        environment: {
          COMPANY_TABLE: companyTable.tableName,
        },
      });
      

    // Grant permissions to Lambda functions
    companyTable.grantReadWriteData(createCompanyLambda);
    // companyTable.grantReadData(getCompanyLambda);
    // doctorCompanyTable.grantReadWriteData(addDoctorLambda);

    // API Gateway
    const api = new apigateway.RestApi(this, 'CompanyApi', {
      restApiName: 'Company Service',
      deploy: true,
      deployOptions: {
        stageName: props.DEPLOY_ENVIRONMENT,
      },
    });

    const companiesResource = api.root.addResource('companies');
    companiesResource.addMethod('POST', new apigateway.LambdaIntegration(createCompanyLambda));
    //companiesResource.addMethod('GET', new apigateway.LambdaIntegration(getCompanyLambda));

//     const companyResource = companiesResource.addResource('{companyId}');
//    // companyResource.addMethod('GET', new apigateway.LambdaIntegration(getCompanyLambda));

//     const doctorsResource = companyResource.addResource('doctors');
//    // doctorsResource.addMethod('POST', new apigateway.LambdaIntegration(addDoctorLambda));
  }
}