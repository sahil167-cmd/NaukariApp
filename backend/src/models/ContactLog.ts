import { Schema, model, Document, Types } from 'mongoose';

export interface IContactLog extends Document {
  userId: Types.ObjectId;
  actionType: 'CALL' | 'WHATSAPP';
  timestamp: Date;
  status: string;
  device?: string;
  platform?: string;
}

const contactLogSchema = new Schema<IContactLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    actionType: {
      type: String,
      enum: ['CALL', 'WHATSAPP'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      default: 'completed',
    },
    device: {
      type: String,
      trim: true,
    },
    platform: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ContactLog = model<IContactLog>('ContactLog', contactLogSchema);
