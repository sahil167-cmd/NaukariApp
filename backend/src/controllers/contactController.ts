import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { ContactLog } from '../models/ContactLog';

export const logContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { actionType, device, platform } = req.body;

    if (!actionType || !['CALL', 'WHATSAPP'].includes(actionType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid actionType. Must be CALL or WHATSAPP.',
      });
    }

    const log = await ContactLog.create({
      userId: user._id,
      actionType,
      device: device || 'Mobile',
      platform: platform || 'unknown',
      timestamp: new Date(),
      status: 'completed',
    });

    return res.status(200).json({
      success: true,
      data: {
        id: log._id,
        actionType: log.actionType,
        timestamp: log.timestamp,
      },
      message: 'Interaction logged successfully',
    });
  } catch (error: any) {
    console.error('Log contact error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
