import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Profile } from '../models/Profile';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyfornaukaribazaar';

export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid 10-digit Indian mobile number',
      });
    }

    // In a real application, MSG91 or Twilio SMS trigger would happen here.
    return res.status(200).json({
      success: true,
      data: { message: 'OTP sent successfully' },
    });
  } catch (error: any) {
    console.error('Request OTP error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid 10-digit Indian mobile number',
      });
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid 6-digit OTP',
      });
    }

    // Accept any 6 digit OTP for simulation in this phase
    // Find or create User
    let user = await User.findOne({ phone });
    let isNew = false;

    if (!user) {
      user = await User.create({
        phone,
        name: 'Worker',
        isVerified: true,
        registrationComplete: false,
      });
      isNew = true;
    } else {
      isNew = !user.registrationComplete;
    }

    // Ensure Profile exists (upsert — never fail if it already exists)
    await Profile.findOneAndUpdate(
      { userId: user._id },
      {
        $setOnInsert: {
          userId: user._id,
          personal: { phone },
          completionPercentage: 0,
        },
      },
      { upsert: true, new: true }
    );

    // Generate JWT
    const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '30d',
    });

    return res.status(200).json({
      success: true,
      data: {
        tokens: {
          accessToken,
          refreshToken,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        },
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          isVerified: user.isVerified,
          registrationComplete: user.registrationComplete,
          createdAt: user.createdAt,
        },
        isNew,
      },
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
