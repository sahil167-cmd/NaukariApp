import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  name: string;
  isVerified: boolean;
  registrationComplete: boolean;
  registrationNumber?: string;
  registrationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      default: 'Worker',
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    registrationComplete: {
      type: Boolean,
      default: false,
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    registrationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', userSchema);
