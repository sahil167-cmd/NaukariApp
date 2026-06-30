import { Schema, model, Document, Types } from 'mongoose';

export interface ISetting extends Document {
  userId: Types.ObjectId;
  language: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    language: {
      type: String,
      default: 'en',
      trim: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light',
      required: true,
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = model<ISetting>('Setting', settingSchema);
