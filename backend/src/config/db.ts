import mongoose from 'mongoose';
import { config } from './env.config';
import { logger } from '../utils/logger';

let isConnected = false;

export const connectDB = async () => {
  const mongoUri = config.MONGO_URI;

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  // Configure listeners
  mongoose.connection.on('connected', () => {
    isConnected = true;
    logger.info(`MongoDB connection established to host: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (err) => {
    isConnected = false;
    logger.error(`MongoDB connection error: ${err.message}`, { error: err });
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    logger.warn('MongoDB connection lost! Reconnect attempts will trigger automatically.');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    logger.info('MongoDB connection re-established.');
  });

  try {
    logger.info('Attempting connection to MongoDB database...');
    await mongoose.connect(mongoUri, options);
  } catch (error: any) {
    logger.error(`MongoDB initial connection failure: ${error.message}`, { error });
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1 && isConnected;
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB connections closed gracefully.');
  } catch (error: any) {
    logger.error(`Error while closing MongoDB connections: ${error.message}`, { error });
  }
};
