import crypto from 'crypto';

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateResetToken = () => { 
  return crypto.randomInt(100000, 999999).toString();
};

export const isCodeExpired = (createdAt) => { 
  const now = Date.now();
  const diff = now - createdAt;
  return diff > 60 * 60 * 1000;
};

