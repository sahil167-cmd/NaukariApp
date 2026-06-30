import dotenv from 'dotenv';
// Load environment variables before importing app
dotenv.config();

import app from './app';
import { connectDB, disconnectDB } from './config/db';
import { logger } from './utils/logger';
import { config } from './config/env.config';

const PORT = config.PORT;

// Catch uncaught exceptions globally
process.on('uncaughtException', (err: Error) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

// Connect to Database
connectDB();

const server = app.listen(PORT, () => {
  logger.info(`Server successfully started in ${config.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  logger.error(`UNHANDLED REJECTION: ${err.message || err}`, { error: err });
  // Close server & exit process
  server.close(() => {
    disconnectDB().finally(() => process.exit(1));
  });
});

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  logger.warn(`Received ${signal}. Starting graceful shutdown procedure...`);
  
  server.close(() => {
    logger.info('Express server closed. Cleaning up database connection...');
    disconnectDB().finally(() => {
      logger.info('Graceful shutdown completed successfully. Exiting.');
      process.exit(0);
    });
  });

  // Force close after 10s if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Graceful shutdown timed out. Forcing termination.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
