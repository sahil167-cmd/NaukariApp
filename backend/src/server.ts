import dotenv from 'dotenv';
// Load environment variables before importing app
dotenv.config();

import app from './app';
import { connectDB, disconnectDB } from './config/db';
import { logger } from './utils/logger';
import { config } from './config/env.config';
import { selfTestService } from './services/selfTest.service';

const PORT = config.PORT;

// Catch uncaught exceptions globally
process.on('uncaughtException', (err: Error) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

let server: any;

const bootstrap = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Run startup health check verification
    await selfTestService.runSelfTests();
  } catch (err: any) {
    logger.error(`Bootstrap process encountered failure: ${err.message}`, { error: err });
  }

  server = app.listen(PORT, () => {
    logger.info(`Server successfully started in ${config.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: any) => {
    logger.error(`UNHANDLED REJECTION: ${err.message || err}`, { error: err });
    // Close server & exit process
    if (server) {
      server.close(() => {
        disconnectDB().finally(() => process.exit(1));
      });
    } else {
      disconnectDB().finally(() => process.exit(1));
    }
  });
};

bootstrap();

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  logger.warn(`Received ${signal}. Starting graceful shutdown procedure...`);
  
  if (server) {
    server.close(() => {
      logger.info('Express server closed. Cleaning up database connection...');
      disconnectDB().finally(() => {
        logger.info('Graceful shutdown completed successfully. Exiting.');
        process.exit(0);
      });
    });
  } else {
    disconnectDB().finally(() => {
      logger.info('Graceful shutdown completed successfully. Exiting.');
      process.exit(0);
    });
  }

  // Force close after 10s if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Graceful shutdown timed out. Forcing termination.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
