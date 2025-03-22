export const buildResponse = (statusCode: number, body: any) => {
    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  };