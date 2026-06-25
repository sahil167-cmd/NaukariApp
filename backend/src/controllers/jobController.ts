import { Request, Response } from 'express';
import { Job } from '../models/Job';

export const getJobs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const category = req.query.category as string;

    const query: any = {};
    if (category) {
      query.category = category;
    }

    const start = (page - 1) * pageSize;
    const total = await Job.countDocuments(query);
    const items = await Job.find(query)
      .sort({ postedAt: -1 })
      .skip(start)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        hasMore: start + pageSize < total,
      },
    });
  } catch (error: any) {
    console.error('Get jobs error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error: any) {
    console.error('Get job by ID error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const applyForJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Return application success log response
    return res.status(200).json({
      success: true,
      data: { applicationId: 'app_' + Date.now() },
      message: 'Application submitted successfully',
    });
  } catch (error: any) {
    console.error('Apply job error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
