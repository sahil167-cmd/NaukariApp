/**
 * Naukri Bazaar — Auth Controller
 * Direct phone-based login/register. No OTP step required.
 */

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Profile } from '../models/Profile';

import { config } from '../config/env.config';

const JWT_SECRET = config.JWT_SECRET;
const JWT_EXPIRES_IN = config.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = config.JWT_REFRESH_EXPIRES_IN;

/**
 * POST /api/v1/auth/login
 * Direct phone login — validates phone, finds or creates user, returns JWT.
 * Each user's data is isolated by userId in all downstream queries.
 */
export const loginWithPhone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    // Strict 10-digit Indian mobile validation
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid 10-digit Indian mobile number (starts with 6-9)',
      });
    }

    // Find or create user
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

    // Ensure Profile exists for this user (upsert — safe if already exists)
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

    // Generate JWT access + refresh tokens (userId embedded → data isolation enforced)
    const accessToken = jwt.sign({ id: user._id, phone: user.phone }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
    });
    const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN as any,
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
    console.error('[Auth] loginWithPhone error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
};

/**
 * POST /api/v1/auth/logout
 * Stateless logout — client discards token.
 */
export const logout = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

/**
 * POST /api/v1/auth/refresh-token
 * Exchange refresh token for new access token.
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const accessToken = jwt.sign({ id: user._id, phone: user.phone }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
    });

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      },
    });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};
