import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

interface CompanyServiceStackProps extends StackProps {
    DEPLOY_ENVIRONMENT: string;}

export class CompanyServiceStack extends Stack {
  public readonly companyTable: dynamodb.Table;
  public readonly doctorCompanyTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props: CompanyServiceStackProps) {
    super(scope, id, props);

    // DynamoDB Tables
    this.companyTable = new dynamodb.Table(this, 'CompanyTable', {
      partitionKey: { name: 'companyId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.doctorCompanyTable = new dynamodb.Table(this, 'DoctorCompanyTable', {
      partitionKey: { name: 'doctorId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'companyId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Lambda Functions
    const createCompanyLambda = new lambda.Function(this, 'CreateCompanyLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'create-company.handler',
      code: lambda.Code.fromAsset('lambda/company-service'),
      environment: {
        COMPANY_TABLE: this.companyTable.tableName,
      },
    });

    const getCompanyLambda = new lambda.Function(this, 'GetCompanyLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'get-company.handler',
      code: lambda.Code.fromAsset('lambda/company-service'),
      environment: {
        COMPANY_TABLE: this.companyTable.tableName,
      },
    });

    const addDoctorLambda = new lambda.Function(this, 'AddDoctorLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'add-doctor.handler',
      code: lambda.Code.fromAsset('lambda/company-service'),
      environment: {
        DOCTOR_COMPANY_TABLE: this.doctorCompanyTable.tableName,
      },
    });

    // Grant permissions to Lambda functions
    this.companyTable.grantReadWriteData(createCompanyLambda);
    this.companyTable.grantReadData(getCompanyLambda);
    this.doctorCompanyTable.grantReadWriteData(addDoctorLambda);

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
    companiesResource.addMethod('GET', new apigateway.LambdaIntegration(getCompanyLambda));

    const companyResource = companiesResource.addResource('{companyId}');
    companyResource.addMethod('GET', new apigateway.LambdaIntegration(getCompanyLambda));

    const doctorsResource = companyResource.addResource('doctors');
    doctorsResource.addMethod('POST', new apigateway.LambdaIntegration(addDoctorLambda));
  }
}