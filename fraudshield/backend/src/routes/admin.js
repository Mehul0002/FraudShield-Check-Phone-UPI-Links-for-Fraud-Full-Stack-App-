import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, generateToken } from '../middleware/auth.js';
import { calculateRiskScore } from '../utils/riskScore.js';

const router = express.Router();
const prisma = new PrismaClient();

// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(admin.id);

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/admin/dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const stats = await prisma.$transaction([
      prisma.report.count({ where: { isApproved: true } }),
      prisma.report.count({ where: { isRejected: true } }),
      prisma.report.count({ where: { isApproved: false, isRejected: false } }),
      prisma.entity.count({ where: { riskScore: { gt: 0 } } }),
      prisma.report.count(),
    ]);

    res.json({
      stats: {
        approvedReports: stats[0],
        rejectedReports: stats[1],
        pendingReports: stats[2],
        riskyEntities: stats[3],
        totalReports: stats[4],
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// GET /api/admin/reports
router.get('/reports', authenticateToken, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.isApproved = status === 'approved';
    if (type) where.entity = { type };

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          entity: true,
          admin: { select: { email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.report.count({ where }),
    ]);

    res.json({
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// PATCH /api/admin/reports/:id/approve
router.patch('/reports/:id/approve', authenticateToken, async (req, res) => {
  try {
    const report = await prisma.report.update({
      where: { id: req.params.id },
      data: {
        isApproved: true,
        approvedAt: new Date(),
        admin: { connect: { id: req.admin.id } },
      },
      include: { entity: true },
    });

    // Update risk score
    await calculateRiskScore(report.entityId);

    res.json({ success: true, message: 'Report approved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve report' });
  }
});

// PATCH /api/admin/reports/:id/reject
router.patch('/reports/:id/reject', authenticateToken, async (req, res) => {
  try {
    await prisma.report.update({
      where: { id: req.params.id },
      data: {
        isRejected: true,
        rejectedAt: new Date(),
        admin: { connect: { id: req.admin.id } },
      },
    });

    res.json({ success: true, message: 'Report rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject report' });
  }
});

// DELETE /api/admin/reports/:id
router.delete('/reports/:id', authenticateToken, async (req, res) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
    });

    if (report?.evidencePath) {
      // Delete file (implement fs.unlink)
      // await fs.unlink(report.evidencePath);
    }

    await prisma.report.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

export default router;
