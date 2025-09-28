import { Context, Next } from 'hono';
import logger from '../utils/logger';

export async function loggingMiddleware(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const url = c.req.url;
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';

  try {
    await next();

    const duration = Date.now() - start;
    const status = c.res.status;

    // Log the request
    logger.http(`${method} ${url}`, {
      method,
      url,
      status,
      duration: `${duration}ms`,
      ip,
      userAgent: c.req.header('user-agent')
    });

    // Log warnings for slow requests
    if (duration > 1000) {
      logger.warn(`Slow request: ${method} ${url} took ${duration}ms`);
    }
  } catch (error) {
    const duration = Date.now() - start;

    logger.error(`Request failed: ${method} ${url}`, {
      method,
      url,
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      ip
    });

    throw error;
  }
}

export async function errorHandler(err: Error, c: Context) {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: c.req.url,
    method: c.req.method,
    body: await c.req.raw.clone().text().catch(() => 'Unable to read body')
  });

  // Return error page
  const errorPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error - Baby Tracker</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 20px;
        }
        .error-container {
          background: white;
          border-radius: 10px;
          padding: 2rem;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .error-code {
          font-size: 4rem;
          font-weight: bold;
          color: #667eea;
          margin: 0;
        }
        .error-message {
          font-size: 1.5rem;
          color: #333;
          margin: 1rem 0;
        }
        .error-details {
          color: #666;
          margin: 1rem 0;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 5px;
          font-family: monospace;
          font-size: 0.9rem;
          word-break: break-all;
        }
        .back-link {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          transition: transform 0.2s;
        }
        .back-link:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <h1 class="error-code">500</h1>
        <p class="error-message">Something went wrong</p>
        ${process.env.NODE_ENV !== 'production' ?
          `<div class="error-details">${err.message}</div>` :
          '<p>We apologize for the inconvenience. Please try again later.</p>'
        }
        <a href="/" class="back-link">Go Home</a>
      </div>
    </body>
    </html>
  `;

  return c.html(errorPage, 500);
}