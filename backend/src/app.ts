import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/api';
import { requestLogger } from './middleware/requestLogger';
import { errorMiddleware } from './middleware/errorMiddleware';
import { isDbConnected } from './config/db';
import { config } from './config/env.config';
import { AppError } from './utils/appError';

const app = express();

// Enable reverse proxy trust (Render, Railway, Heroku, Nginx, Cloudflare)
app.set('trust proxy', 1);

// Security Headers
app.use(helmet());

// Cors setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-request-id'],
}));

// Request compression
app.use(compression());

// JSON & URL Encoded parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Correlation ID & Structured Logging Middleware
app.use(requestLogger);

// Dev request logging
if (config.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Custom NoSQL Injection Sanitization Middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const sanitize = (obj: any): any => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
    return obj;
  };
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
});

// Production rate limit configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress || 'unknown';
  },
  handler: (req, res, next) => {
    next(new AppError('Too many requests, please try again later.', 429, 'RATE_LIMIT_EXCEEDED'));
  }
});
app.use('/api/', limiter);

// ── Health Check & System Diagnostics ────────────────────────────────────────

// 1. Root landing page
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend Running Successfully',
  });
});

// 2. Health endpoint check database and general uptime
app.get('/health', (req, res) => {
  const dbStatus = isDbConnected() ? 'CONNECTED' : 'DISCONNECTED';
  res.status(200).json({
    success: true,
    status: 'UP',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// 3. Ready check for container orchestration
app.get('/ready', (req, res) => {
  if (isDbConnected()) {
    return res.status(200).json({ success: true, status: 'READY' });
  }
  return res.status(503).json({ success: false, status: 'NOT_READY', message: 'Database connection offline' });
});

// 4. Version metadata
app.get('/version', (req, res) => {
  res.status(200).json({
    success: true,
    version: config.APP_VERSION,
    environment: config.NODE_ENV,
    uptime: process.uptime(),
  });
});

// Mount API routes
app.use('/api/v1', apiRouter);

// 404 Route Handler
app.use((req, res, next) => {
  next(new AppError(`Endpoint ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
});

// Global Error Handler Middleware
app.use(errorMiddleware);

export default app;
