import { App } from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';

const app = new App();
if (!process.env.DEPLOY_ENVIRONMENT) throw new Error("DEPLOY_ENVIRONMENT is not defined.")
const { DEPLOY_ENVIRONMENT } = process.env;

new InfrastructureStack(
  app,
  `${DEPLOY_ENVIRONMENT}-Infrastructure-Stack`, 
  {
    DEPLOY_ENVIRONMENT,
    description: `Stack for the ${DEPLOY_ENVIRONMENT} infrastructure deployed using the CI pipeline. If you need to delete everything involving the ${DEPLOY_ENVIRONMENT} environment, delete this stack first, then the CI stack.`
  }
);