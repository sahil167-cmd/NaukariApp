import dotenv from 'dotenv';
import path from 'path';

// Load .env from the backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

import { recruitmentPipelineService } from '../src/services/recruitmentPipeline.service';
import { logger } from '../src/utils/logger';

async function runTest() {
  logger.info('--- Running Recruitment Pipeline Test ---');

  const mockUser = {
    _id: '6682abc123def4567890ffff',
    phone: '+919999999999',
    name: 'Rohan Sharma',
    createdAt: new Date(),
    language: 'hi',
  };

  const mockProfile = {
    userId: mockUser._id,
    personal: {
      firstName: 'Rohan',
      lastName: 'Sharma',
      dob: '1998-05-15',
      gender: 'Male',
      phone: '+919999999999',
      languages: {
        Hindi: { read: true, write: true, speak: true },
        English: { read: true, write: false, speak: true },
      },
    },
    address: {
      state: 'Maharashtra',
      district: 'Mumbai',
      city: 'Mumbai Suburban',
      pinCode: '400001',
    },
    jobPreferences: {
      categories: ['Delivery Executive', 'Driver'],
      salaryRange: '15000-20000',
      shiftPreference: 'Day Shift',
    },
    education: {
      highestLevel: '12th Pass',
      specialization: 'Commerce',
    },
    experience: [
      {
        companyName: 'Express Delivery Services',
        jobRole: 'Courier Boy',
        duration: '2 Years',
      },
    ],
  };

  try {
    await recruitmentPipelineService.processNewRegistration(mockUser, mockProfile, {});
    logger.info('Pipeline test executed successfully!');
  } catch (error: any) {
    logger.error('Pipeline test threw an uncaught exception:', { error: error.message });
  }
}

runTest().catch((err) => console.error('Uncaught error in test runner:', err));
