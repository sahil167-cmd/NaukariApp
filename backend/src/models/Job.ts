import { Schema, model, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  salary: string;
  category: string;
  type: string;
  description: string;
  isVerified: boolean;
  urgentHiring: boolean;
  postedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    salary: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    type: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    isVerified: { type: Boolean, default: true },
    urgentHiring: { type: Boolean, default: false },
    postedAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
);

export const Job = model<IJob>('Job', jobSchema);
