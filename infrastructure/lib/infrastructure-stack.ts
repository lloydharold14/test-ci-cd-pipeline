import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CompanyServiceStack } from './microservices/company-service-stack';

interface InfrastructureStackProps extends StackProps {
  DEPLOY_ENVIRONMENT: string;
}

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props: InfrastructureStackProps) {
    super(scope, id, props);

    const { DEPLOY_ENVIRONMENT } = props;

    console.log(`${DEPLOY_ENVIRONMENT} environment detected. Deploying S3 bucket.`);

    const infraBucket = new Bucket(this, "InfraBucket", {
      bucketName: `health-manager-${DEPLOY_ENVIRONMENT}-infrastructure-bucket`,
      removalPolicy: RemovalPolicy.DESTROY,
    });


  }
}
