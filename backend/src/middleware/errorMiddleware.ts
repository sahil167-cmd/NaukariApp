import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  const requestId = (req as any).requestId || 'no-request-id';

  // Build centralized response payload
  const errorResponse = {
    success: false,
    message: err.isOperational ? err.message : 'An unexpected server error occurred',
    errorCode,
    timestamp: new Date().toISOString(),
    requestId,
    ...(err.errors ? { errors: err.errors } : {}),
  };

  // Structured logging of the error
  if (err.isOperational) {
    logger.warn({
      message: `Operational Error: [${req.method}] ${req.originalUrl} - Status: ${statusCode} - Code: ${errorCode} - Message: ${err.message}`,
      requestId,
      statusCode,
      errorCode,
      errors: err.errors,
    });
  } else {
    logger.error({
      message: `Unhandled Error: [${req.method}] ${req.originalUrl} - Message: ${err.message}`,
      requestId,
      stack: err.stack,
      statusCode,
      errorCode,
    });
  }

  return res.status(statusCode).json(errorResponse);
};
