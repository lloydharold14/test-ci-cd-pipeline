import { Context } from 'aws-lambda';

export const logger = {
  info: (message: string, context?: Context) => {
    console.log(JSON.stringify({ message, context }));
  },
  error: (message: string, error: Error, context?: Context) => {
    console.error(JSON.stringify({ message, error: error.message, stack: error.stack, context }));
  },
};