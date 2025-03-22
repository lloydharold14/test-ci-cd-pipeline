export class AppError extends Error {
    constructor(public message: string, public statusCode: number = 400) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export const handleError = (error: Error) => {
    if (error instanceof AppError) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({ message: error.message }),
      };
    } else {
      console.error('Unhandled Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      };
    }
  };