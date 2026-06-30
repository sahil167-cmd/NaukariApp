import { Schema, model, Document } from 'mongoose';

export interface ILanguage extends Document {
  code: string;
  name: string;
  nativeName: string;
  translations: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const languageSchema = new Schema<ILanguage>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nativeName: {
      type: String,
      required: true,
      trim: true,
    },
    translations: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Language = model<ILanguage>('Language', languageSchema);
