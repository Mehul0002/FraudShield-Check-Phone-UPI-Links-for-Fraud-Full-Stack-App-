import { ENTITY_TYPES } from './constants.js';

export const normalizeEntity = (type, value) => {
  if (!value || typeof value !== 'string') {
    throw new Error('Invalid value');
  }

  const normalized = value.trim().toLowerCase();

  switch (type) {
    case 'PHONE':
      // Remove all non-digits, keep last 10 digits for Indian numbers
      const digits = normalized.replace(/\D/g, '');
      return digits.length >= 10 ? digits.slice(-10) : digits;

    case 'UPI':
      // UPI is already lowercase + trim
      return normalized.replace(/@[^@]*$/i, '@$&').toLowerCase(); // Preserve @domain

    case 'URL':
      try {
        const url = new URL(value.startsWith('http') ? value : `https://${value}`);
        // Normalize to domain + path (ignore www, protocol)
        return url.hostname.replace(/^www\./, '') + url.pathname.replace(/\/$/, '');
      } catch {
        return normalized;
      }

    default:
      throw new Error('Invalid entity type');
  }
};

export const validateEntity = (type, value) => {
  const normalized = normalizeEntity(type, value);

  switch (type) {
    case 'PHONE':
      return /^\d{10,15}$/.test(normalized);
    
    case 'UPI':
      return /^[a-z0-9][a-z0-9.-]{1,30}@[a-z][a-z0-9.-]{1,30}$/i.test(value);
    
    case 'URL':
      try {
        new URL(value.startsWith('http') ? value : `https://${value}`);
        return true;
      } catch {
        return false;
      }

    default:
      return false;
  }
};
