import { Schema, model, Document, Types } from 'mongoose';

export interface IProfile extends Document {
  userId: Types.ObjectId;
  personal?: {
    firstName?: string;
    lastName?: string;
    dob?: string;
    gender?: string;
    phone?: string;
    email?: string;
    profilePhoto?: string;
  };
  address?: {
    houseNumber?: string;
    streetAddress?: string;
    landmark?: string;
    city?: string;
    district?: string;
    state?: string;
    pinCode?: string;
  };
  jobPreferences?: {
    categories?: string[];
    salaryRange?: string;
    preferredLocations?: string[];
    shiftPreference?: string;
    immediatelyAvailable?: boolean;
    willingToRelocate?: boolean;
  };
  education?: {
    highestLevel?: string;
    specialization?: string;
    institutionName?: string;
    passingYear?: string;
  };
  experience?: Array<{
    companyName?: string;
    jobRole?: string;
    duration?: string;
    location?: string;
    skills?: string[];
    isCurrent?: boolean;
  }>;
  documents?: {
    profilePhoto?: string;
  };
  completionPercentage: number;
  registrationNo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    personal: {
      firstName: { type: String, default: '', trim: true },
      lastName: { type: String, default: '', trim: true },
      dob: { type: String, default: '', trim: true },
      gender: { type: String, default: '', trim: true },
      phone: { type: String, default: '', trim: true },
      email: { type: String, default: '', trim: true },
      profilePhoto: { type: String, default: '' },
    },
    address: {
      houseNumber: { type: String, default: '', trim: true },
      streetAddress: { type: String, default: '', trim: true },
      landmark: { type: String, default: '', trim: true },
      city: { type: String, default: '', trim: true },
      district: { type: String, default: '', trim: true },
      state: { type: String, default: '', trim: true },
      pinCode: { type: String, default: '', trim: true },
    },
    jobPreferences: {
      categories: [{ type: String }],
      salaryRange: { type: String, default: '', trim: true },
      preferredLocations: [{ type: String }],
      shiftPreference: { type: String, default: '', trim: true },
      immediatelyAvailable: { type: Boolean, default: false },
      willingToRelocate: { type: Boolean, default: false },
    },
    education: {
      highestLevel: { type: String, default: '', trim: true },
      specialization: { type: String, default: '', trim: true },
      institutionName: { type: String, default: '', trim: true },
      passingYear: { type: String, default: '', trim: true },
    },
    experience: [
      {
        companyName: { type: String, default: '', trim: true },
        jobRole: { type: String, default: '', trim: true },
        duration: { type: String, default: '', trim: true },
        location: { type: String, default: '', trim: true },
        skills: [{ type: String }],
        isCurrent: { type: Boolean, default: false },
      },
    ],
    documents: {
      profilePhoto: { type: String, default: '' },
    },
    completionPercentage: {
      type: Number,
      default: 0,
    },
    registrationNo: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Profile = model<IProfile>('Profile', profileSchema);
