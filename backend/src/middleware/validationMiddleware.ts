import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

/**
 * Global validator response runner
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg || 'Validation failed. Please correct input values.',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Validation rules for registration & profile updates
 */
export const profileValidationRules = [
  body('personal.firstName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('personal.lastName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('personal.email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Enter a valid email address')
    .normalizeEmail(),
  body('personal.phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Enter a valid 10-digit Indian phone number'),
  body('personal.gender')
    .optional()
    .isString()
    .trim(),
  body('personal.dob')
    .optional()
    .isString()
    .trim(),

  body('address.streetAddress')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Street address must be at least 5 characters'),
  body('address.city')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.district')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('District is required'),
  body('address.state')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('address.pinCode')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('Enter a valid 6-digit PIN code'),

  body('jobPreferences.categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array of strings'),
  body('jobPreferences.salaryRange')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Salary range is required'),
  body('jobPreferences.salaryRange')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Salary range is required'),
  body('jobPreferences.shiftPreference')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Shift preference is required'),

  body('education.highestLevel')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Education level is required'),

  body('experience')
    .optional()
    .isArray()
    .withMessage('Experience must be an array'),
  body('experience.*.companyName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Company name must be at least 2 characters'),
  body('experience.*.jobRole')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Job role is required'),
  body('experience.*.duration')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Duration is required'),
];
