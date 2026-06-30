import { Schema, model, Document, Types } from 'mongoose';

export interface ISupportRequest extends Document {
  userId?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const supportRequestSchema = new Schema<ISupportRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

supportRequestSchema.index({ status: 1, createdAt: -1 });

export const SupportRequest = model<ISupportRequest>('SupportRequest', supportRequestSchema);
