import { App } from 'aws-cdk-lib';
import { CompanyServiceStack } from '../lib/microservices/company-service-stack';

const app = new App();
if (!process.env.DEPLOY_ENVIRONMENT) throw new Error("DEPLOY_ENVIRONMENT is not defined.")
const { DEPLOY_ENVIRONMENT } = process.env;

// Deploy the Company Service stack by instantiating it
new CompanyServiceStack(
  app,
  `${DEPLOY_ENVIRONMENT}-CompanyService-Stack`, 
  {
    DEPLOY_ENVIRONMENT,
    description: `Stack for the ${DEPLOY_ENVIRONMENT} CompanyService deployed using the CI pipeline. If you need to delete everything involving the ${DEPLOY_ENVIRONMENT} environment, delete this stack first, then the CI stack.`,
  }
);