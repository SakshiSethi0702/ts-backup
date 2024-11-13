import express from 'express';
import { Handler, HandlerResponse } from '@netlify/functions';

const app = express();
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express on Netlify!' });
});

// This is the handler for the Netlify function
const handler: Handler = async (event: any, context: any): Promise<HandlerResponse> => {
  return new Promise((resolve, reject) => {
    // Manually construct the Express req and res objects
    const req = {
      method: event.httpMethod,
      url: event.path,
      headers: event.headers,
      body: event.body,
    };

    const res:any = {
      statusCode: 200,
      body: '',
      headers: {},
      setHeader: (key: any, value: string) => {
        res.headers[key] = value;
      },
      json: (data: any) => {
        res.body = JSON.stringify(data);
        resolve({
          statusCode: res.statusCode,
          body: res.body,
          headers: res.headers,
        });
      },
    };

    // Manually invoke the Express app's request handler
    app(req as any, res as any, (err: any) => {
      if (err) {
        console.error('Error occurred:', err);
        reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Something went wrong' }),
        });
      }
    });
  });
};

export { handler };
