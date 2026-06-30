import { Schema, model, Document, Types } from 'mongoose';

export interface IDocument extends Document {
  userId: Types.ObjectId;
  documentType: 'profile_photo' | 'aadhaar' | 'pan' | 'resume' | 'other';
  documentUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    documentType: {
      type: String,
      enum: ['profile_photo', 'aadhaar', 'pan', 'resume', 'other'],
      required: true,
    },
    documentUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.index({ userId: 1, documentType: 1 });

export const DocumentModel = model<IDocument>('Document', documentSchema);
