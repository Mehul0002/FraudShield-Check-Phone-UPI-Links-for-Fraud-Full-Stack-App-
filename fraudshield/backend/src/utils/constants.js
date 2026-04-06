// Fraud categories with weights for risk scoring
export const FRAUD_CATEGORIES = {
  PHISHING: { weight: 10, color: 'red' },
  OTP_FRAUD: { weight: 12, color: 'red' },
  FAKE_PAYMENT: { weight: 9, color: 'orange' },
  LOAN_SCAM: { weight: 8, color: 'orange' },
  DELIVERY_SCAM: { weight: 7, color: 'yellow' },
  IMPERSONATION: { weight: 9, color: 'orange' },
  JOB_SCAM: { weight: 8, color: 'orange' },
  INVESTMENT_SCAM: { weight: 10, color: 'red' },
  TECH_SUPPORT_SCAM: { weight: 8, color: 'orange' },
  SPAM: { weight: 4, color: 'blue' },
  OTHER: { weight: 3, color: 'gray' },
};

export const ENTITY_TYPES = {
  PHONE: 'Phone Number',
  UPI: 'UPI ID',
  URL: 'URL/Link',
};

export const RISK_LEVELS = {
  SAFE: { score: [0, 20], color: 'green', label: 'Safe' },
  LOW_RISK: { score: [21, 50], color: 'blue', label: 'Low Risk' },
  SUSPICIOUS: { score: [51, 80], color: 'orange', label: 'Suspicious' },
  HIGH_RISK: { score: [81, 100], color: 'red', label: 'High Risk' },
};

export const MAX_RISK_SCORE = 100;
