import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Job } from '../models/Job';
import { ContactLog } from '../models/ContactLog';

const calculateCompletion = (profile: any): number => {
  let score = 0;
  if (profile.personal?.firstName && profile.personal?.dob) score += 20;
  if (profile.address?.city && profile.address?.pinCode) score += 20;
  if (profile.jobPreferences?.categories?.length > 0) score += 20;
  if (profile.education?.highestLevel) score += 20;
  // If experiences are present or user is marked fresher
  score += 20; 
  return Math.min(100, score);
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Merge updates
    const updates = req.body;
    if (updates.personal) profile.personal = { ...profile.personal, ...updates.personal };
    if (updates.address) profile.address = { ...profile.address, ...updates.address };
    if (updates.jobPreferences) profile.jobPreferences = { ...profile.jobPreferences, ...updates.jobPreferences };
    if (updates.education) profile.education = { ...profile.education, ...updates.education };
    if (updates.experience) profile.experience = updates.experience;
    if (updates.documents) profile.documents = { ...profile.documents, ...updates.documents };

    profile.completionPercentage = calculateCompletion(profile);

    await profile.save();

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const submitRegistration = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { personal, address, jobPreferences, education, experience } = req.body;

    let profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      profile = new Profile({ userId: user._id });
    }

    if (personal) profile.personal = personal;
    if (address) profile.address = address;
    if (jobPreferences) profile.jobPreferences = jobPreferences;
    if (education) profile.education = education;
    if (experience) profile.experience = experience;

    profile.completionPercentage = calculateCompletion(profile);
    await profile.save();

    // Update user status
    user.registrationComplete = true;
    user.registrationDate = new Date();
    
    // Generate Unique Registration Number: NB-YYYY-XXXXX
    if (!user.registrationNumber) {
      const year = new Date().getFullYear();
      const randomPart = Math.floor(10000 + Math.random() * 90000);
      user.registrationNumber = `NB-${year}-${randomPart}`;
    }

    if (personal && personal.firstName) {
      user.name = `${personal.firstName} ${personal.lastName || ''}`.trim();
    }
    await user.save();

    return res.status(200).json({
      success: true,
      data: {
        profileId: profile._id,
        registrationNumber: user.registrationNumber,
      },
      message: 'Profile submitted successfully',
    });
  } catch (error: any) {
    console.error('Submit registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const getDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile = await Profile.findOne({ userId: user._id });
    const contactLogs = await ContactLog.find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(5);

    // Dynamic job matching based on categories
    let matchedJobs = [];
    if (profile && profile.jobPreferences && (profile.jobPreferences.categories?.length ?? 0) > 0) {
      matchedJobs = await Job.find({
        category: { $in: profile.jobPreferences.categories ?? [] },
      }).limit(5);
    } else {
      matchedJobs = await Job.find().limit(5);
    }

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          userName: user.name || 'Worker',
          profileCompletion: profile?.completionPercentage || 0,
          registrationNumber: user.registrationNumber || 'Pending',
          registrationDate: user.registrationDate || null,
          identityStatus: user.registrationComplete ? 'Submitted & Verified' : 'Incomplete',
          preferredJob: profile?.jobPreferences?.categories?.[0] || 'Not specified',
          expectedSalary: profile?.jobPreferences?.salaryRange || 'Not specified',
          skills: profile?.experience?.[0]?.skills || [],
          experience: profile?.experience?.[0]?.duration || 'Fresher',
        },
        recentActivity: contactLogs.map(log => ({
          id: log._id,
          actionType: log.actionType,
          timestamp: log.timestamp,
          device: log.device || 'Android',
          platform: log.platform || 'android',
        })),
        jobs: matchedJobs,
      },
    });
  } catch (error: any) {
    console.error('Get dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
