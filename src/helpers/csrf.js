const isEdgeRuntime = typeof EdgeRuntime !== 'undefined';

export const generateCSRFToken = () => {
  if (isEdgeRuntime || typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  } else {
    const nodeCrypto = require('crypto');
    return nodeCrypto.randomBytes(32).toString('hex');
  }
};

const timingSafeEqual = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

export const verifyCSRFToken = (sessionToken, requestToken) => {
  if (!sessionToken || !requestToken) {
    return false;
  }
  
  if (isEdgeRuntime || typeof Buffer === 'undefined') {
    return timingSafeEqual(sessionToken, requestToken);
  } else {
    // Use Node.js crypto.timingSafeEqual for better security
    const nodeCrypto = require('crypto');
    try {
      return nodeCrypto.timingSafeEqual(
        Buffer.from(sessionToken, 'hex'),
        Buffer.from(requestToken, 'hex')
      );
    } catch (error) {
      return timingSafeEqual(sessionToken, requestToken);
    }
  }
};

// Set CSRF token in response
export const setCSRFToken = (response, token = null) => {
  const csrfToken = token || generateCSRFToken();
  response.cookies.set("csrf-token", csrfToken, {
    httpOnly: false, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60,  // 24 hours
    path: "/"
  });
  return csrfToken;
};

const CSRF_EXEMPT_ROUTES = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/refresh',
  '/api/auth/verify',
  '/api/auth/forgot-password'
];

export const needsCSRFProtection = (pathname, method) => {
  // Only protect state-changing operations
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return false;
  }
  
  return !CSRF_EXEMPT_ROUTES.some(route => pathname.startsWith(route));
};

// Middleware to check CSRF for protected routes
export const requireCSRF = (req) => {
  const pathname = new URL(req.url).pathname;
  const method = req.method;
  
  if (!needsCSRFProtection(pathname, method)) {
    return true;
  }
  
  const sessionCSRF = req.cookies.get('csrf-token')?.value;
  const requestCSRF = req.headers.get('x-csrf-token') || req.headers.get('X-CSRF-Token');
  
  if (!sessionCSRF || !requestCSRF) {
    throw new Error('CSRF token missing');
  }
  
  if (!verifyCSRFToken(sessionCSRF, requestCSRF)) {
    throw new Error('Invalid CSRF token');
  }
  
  return true;
};
