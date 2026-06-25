import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Job } from './models/Job';

dotenv.config();

const jobs = [
  {
    title: 'Construction Helper',
    company: 'BuildFast Infra Pvt. Ltd.',
    location: 'Andheri, Mumbai',
    salary: '₹12,000 - ₹15,000',
    category: 'Construction',
    type: 'Full Time',
    description: 'Looking for experienced construction helpers for ongoing residential projects in Andheri. Standard day shift with overtime benefits.',
    isVerified: true,
    urgentHiring: true,
  },
  {
    title: 'Security Guard',
    company: 'SafeGuard Security Services',
    location: 'Whitefield, Bangalore',
    salary: '₹10,000 - ₹13,000',
    category: 'Security',
    type: 'Full Time',
    description: 'Security guard required for commercial IT park in Whitefield. Day and night shifts available. Basic training will be provided.',
    isVerified: true,
    urgentHiring: false,
  },
  {
    title: 'Delivery Executive',
    company: 'QuickShip Logistics',
    location: 'Connaught Place, Delhi',
    salary: '₹14,000 - ₹18,000',
    category: 'Logistics & Delivery',
    type: 'Full Time',
    description: 'Logistics delivery executive needed for Connaught Place area. Two-wheeler vehicle and valid driving license required.',
    isVerified: true,
    urgentHiring: true,
  },
  {
    title: 'Factory Worker',
    company: 'Precision Metals Ltd.',
    location: 'Pune, Maharashtra',
    salary: '₹11,000 - ₹14,000',
    category: 'Manufacturing',
    type: 'Full Time',
    description: 'Production line assembly workers needed for metal stamping factory. Technical or ITI background preferred but not mandatory.',
    isVerified: true,
    urgentHiring: false,
  },
  {
    title: 'House Keeping Staff',
    company: 'CleanPro Services',
    location: 'Gurgaon, Haryana',
    salary: '₹9,000 - ₹11,000',
    category: 'Cleaning',
    type: 'Full Time',
    description: 'Corporate office housekeeper. Tasks include maintaining clean environment in corridors, offices and meeting halls.',
    isVerified: false,
    urgentHiring: false,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/naukari-bazaar';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB for seeding...');

    await Job.deleteMany({});
    console.log('Cleared existing jobs...');

    await Job.insertMany(jobs);
    console.log('Seeded standard job listings successfully!');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
