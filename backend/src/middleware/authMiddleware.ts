/**
 * Naukri Bazaar — Auth Middleware
 * Production-grade JWT enforcement.
 * Each user can ONLY access their own data — enforced via userId from JWT.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyfornaukaribazaar';

/**
 * Protect middleware — strictly validates JWT and attaches req.user.
 * If token is missing or invalid, responds with 401.
 * Data isolation: every downstream query uses req.user._id,
 * so one user can NEVER access another user's profile or data.
 */
export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login to continue.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id).select('-__v');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
      });
    }

    // Attach user to request — all protected routes use req.user._id for data isolation
    req.user = user;
    return next();
  } catch (error: any) {
    console.error('[Auth] JWT verification failed:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token. Please login again.',
      code: 'INVALID_TOKEN',
    });
  }
};
