import { Request, Response, NextFunction } from 'express';

// Extend Express Response interface to store standard response methods if needed
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

/**
 * Standard Response Formatter Middleware
 * Intercepts res.json to automatically format both success and failure payloads
 */
export const responseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Try to grab a request ID from headers (supplied by gateway/proxy or frontend) or generate one
  const requestId = (req.headers['x-request-id'] as string) || req.id || Math.random().toString(36).substring(2, 11);
  req.id = requestId;
  res.setHeader('x-request-id', requestId);

  // Cache the original res.json function
  const originalJson = res.json;

  // Override res.json
  res.json = function (body: any): Response {
    // If the body is already standard-formatted, bypass wrapping
    if (body && typeof body === 'object' && 'success' in body && 'timestamp' in body && 'requestId' in body) {
      return originalJson.call(this, body);
    }

    const timestamp = new Date().toISOString();

    // Check if the response represents an error (status code >= 400 or body.success === false)
    const isError = res.statusCode >= 400 || (body && typeof body === 'object' && body.success === false);

    if (isError) {
      const errorMsg = body?.message || body?.error || 'An error occurred';
      const errorCode = body?.code || (res.statusCode === 404 ? 'ROUTE_NOT_FOUND' : res.statusCode === 401 ? 'UNAUTHORIZED' : res.statusCode === 403 ? 'FORBIDDEN' : 'BAD_REQUEST');
      
      const failureResponse: any = {
        success: false,
        error: errorMsg,
        code: errorCode,
        message: errorMsg,
        timestamp,
        requestId,
      };

      if (body?.errors) {
        failureResponse.errors = body.errors;
      }

      return originalJson.call(this, failureResponse);
    }

    // Success response formatting
    const msg = body?.message || 'Operation completed successfully';
    
    // Determine target data
    let dataPayload = body;
    if (body && typeof body === 'object') {
      if ('success' in body) {
        // If it was already wrapped in { success, data }, extract data
        dataPayload = 'data' in body ? body.data : body;
      }
    }

    const successResponse = {
      success: true,
      message: msg,
      data: dataPayload,
      timestamp,
      requestId,
    };

    return originalJson.call(this, successResponse);
  };

  next();
};
