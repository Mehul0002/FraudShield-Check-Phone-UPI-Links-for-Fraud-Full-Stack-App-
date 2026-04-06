import { PrismaClient } from '@prisma/client';
import { FRAUD_CATEGORIES, MAX_RISK_SCORE } from './constants.js';

const prisma = new PrismaClient();

const CATEGORY_WEIGHTS = {
  PHISHING: 10,
  'OTP_FRAUD': 12,
  'FAKE_PAYMENT': 9,
  'LOAN_SCAM': 8,
  'DELIVERY_SCAM': 7,
  'IMPERSONATION': 9,
  'JOB_SCAM': 8,
  'INVESTMENT_SCAM': 10,
  'TECH_SUPPORT_SCAM': 8,
  SPAM: 4,
  OTHER: 3,
};

export const calculateRiskScore = async (entityId) => {
  const reports = await prisma.report.findMany({
    where: {
      entityId,
      isApproved: true,
      isRejected: false,
    },
  });

  if (reports.length === 0) return 0;

  let score = 0;

  // Calculate base score from approved reports
  reports.forEach((report) => {
    const weight = CATEGORY_WEIGHTS[report.fraudCategory] || 3;
    score += weight;
  });

  // Decay factor for older reports (recent reports weigh more)
  const now = new Date();
  reports.forEach((report) => {
    const ageDays = (now - new Date(report.createdAt)) / (1000 * 60 * 60 * 24);
    const decay = Math.max(0.1, 1 - ageDays / 365); // Full weight in 1 year
    score *= decay;
  });

  // Unique reporters bonus
  const uniqueEmails = new Set(reports.map(r => r.reporterEmail).filter(Boolean));
  score += uniqueEmails.size * 2;

  // Cap at max score
  score = Math.min(score, MAX_RISK_SCORE);

  // Recalculate and update entity
  await prisma.entity.update({
    where: { id: entityId },
    data: { 
      riskScore: Math.round(score),
      updatedAt: now,
    },
  });

  return Math.round(score);
};

export const getRiskStatus = (score) => {
  if (score <= 20) return 'SAFE';
  if (score <= 50) return 'LOW_RISK';
  if (score <= 80) return 'SUSPICIOUS';
  return 'HIGH_RISK';
};
