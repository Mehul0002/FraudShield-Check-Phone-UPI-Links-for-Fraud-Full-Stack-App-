import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { reportLimiter, searchLimiter } from '../middleware/rateLimit.js';
import { uploadMiddleware } from '../middleware/upload.js';
import { normalizeEntity, validateEntity } from '../utils/normalize.js';
import { calculateRiskScore } from '../utils/riskScore.js';

const router = express.Router();
const prisma = new PrismaClient();

// Search schema
const searchSchema = z.object({
  type: z.enum(['PHONE', 'UPI', 'URL']),
  value: z.string().min(1),
});

// Report schema
const reportSchema = z.object({
  type: z.enum(['PHONE', 'UPI', 'URL']),
  value: z.string().min(1),
  fraudCategory: z.enum(['PHISHING', 'OTP_FRAUD', 'FAKE_PAYMENT', 'LOAN_SCAM', 'DELIVERY_SCAM', 'IMPERSONATION', 'JOB_SCAM', 'INVESTMENT_SCAM', 'TECH_SUPPORT_SCAM', 'SPAM', 'OTHER']),
  description: z.string().min(10).max(1000),
  reporterName: z.string().optional(),
  reporterEmail: z.string().email().optional(),
});

// GET /api/search
router.get('/search', searchLimiter, async (req, res) => {
  try {
    const { type, value } = searchSchema.parse(req.query);
    
    if (!validateEntity(type, value)) {
      return res.status(400).json({ error: 'Invalid entity format' });
    }

    const normalizedValue = normalizeEntity(type, value);
    
    const entity = await prisma.entity.findFirst({
      where: {
        type,
        normalizedValue,
      },
      include: {
        reports: {
          where: {
            isApproved: true,
            isRejected: false,
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { reports: true, comments: true },
        },
      },
    });

    res.json({
      entity,
      riskScore: entity?.riskScore || 0,
      status: entity?.status || 'SAFE',
      reportsCount: entity?._count?.reports || 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Search failed' });
  }
});

// POST /api/reports
router.post('/reports', reportLimiter, uploadMiddleware, async (req, res) => {
  try {
    const data = reportSchema.parse(req.body);
    
    if (!validateEntity(data.type, data.value)) {
      return res.status(400).json({ error: 'Invalid entity format' });
    }

    const normalizedValue = normalizeEntity(data.type, data.value);
    
    // Check if duplicate recent report from same email
    const recentDuplicate = await prisma.report.findFirst({
      where: {
        entity: {
          type: data.type,
          normalizedValue,
        },
        reporterEmail: data.reporterEmail,
        description: {
          contains: data.description.slice(0, 50),
        },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24h
        },
      },
    });

    if (recentDuplicate) {
      return res.status(429).json({ error: 'Duplicate report detected. Please wait 24h.' });
    }

    // Find or create entity
    let entity = await prisma.entity.findFirst({
      where: {
        type: data.type,
        normalizedValue,
      },
    });

    if (!entity) {
      entity = await prisma.entity.create({
        data: {
          type: data.type,
          value: data.value,
          normalizedValue,
        },
      });
    }

    const report = await prisma.report.create({
      data: {
        entityId: entity.id,
        reporterName: data.reporterName,
        reporterEmail: data.reporterEmail,
        fraudCategory: data.fraudCategory,
        description: data.description,
        evidencePath: req.file?.path,
      },
    });

    // Recalculate risk score
    await calculateRiskScore(entity.id);

    res.json({
      success: true,
      message: 'Report submitted successfully! Awaiting admin approval.',
      reportId: report.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Entity already exists' });
    }
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// GET /api/reports/recent
router.get('/reports/recent', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const reports = await prisma.report.findMany({
      where: {
        isApproved: true,
        isRejected: false,
      },
      include: {
        entity: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await prisma.report.count({
      where: {
        isApproved: true,
        isRejected: false,
      },
    });

    res.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent reports' });
  }
});

export default router;
