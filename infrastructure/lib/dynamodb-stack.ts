import {Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TableV2, Billing, AttributeType } from 'aws-cdk-lib/aws-dynamodb';

export class CdkDeployDynamodbStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const ddbTable = new TableV2(
      this,
      "DynamoDbTable",
      {
        partitionKey: {
          name: "user_id",
          type: AttributeType.STRING
        },
        sortKey: {
          name: "timestamp",
          type: AttributeType.NUMBER
        },
        tableName: "SampleTable",
        billing: Billing.onDemand(),
        removalPolicy: RemovalPolicy.DESTROY,
      }
    )

  }
}