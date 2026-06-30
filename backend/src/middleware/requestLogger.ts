import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Capture or generate Request Correlation ID
  const requestId = (req.headers['x-request-id'] as string) || Math.random().toString(36).substring(2, 15);
  (req as any).requestId = requestId;
  res.setHeader('x-request-id', requestId);

  const start = Date.now();

  // Log incoming request
  logger.info({
    message: `Incoming Request: [${req.method}] ${req.originalUrl} from IP: ${req.ip}`,
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  // Intercept response finish event
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      message: `Completed Request: [${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`,
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
    });
  });

  next();
};
