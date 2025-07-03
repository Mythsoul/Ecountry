import { NextResponse } from 'next/server';
const generateCSRFToken = () => {
  return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
};

const setCSRFToken = (response, token = null) => {
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

// Routes that don't need CSRF protection
const CSRF_EXEMPT_ROUTES = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/refresh',
  '/api/auth/verify-email',
  '/api/auth/forgot-password'
];

// Check if route needs CSRF protection
const needsCSRFProtection = (pathname, method) => {
  // Only protect state-changing operations
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return false;
  }
  
  // Skip CSRF for exempt routes
  return !CSRF_EXEMPT_ROUTES.some(route => pathname.startsWith(route));
};

// Simple timing-safe string comparison for Edge Runtime
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

// Verify CSRF token
const verifyCSRFToken = (sessionToken, requestToken) => {
  if (!sessionToken || !requestToken) {
    return false;
  }
  return timingSafeEqual(sessionToken, requestToken);
};

// Middleware to check CSRF for protected routes
const requireCSRF = (req) => {
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

// Simple token presence check (actual verification done in route handlers)
const hasValidTokenFormat = (token) => {
  if (!token) return false;
  // Basic JWT format check: header.payload.signature
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/api/auth/logout',
  '/api/auth/verify-token',
  '/api/game',
  '/api/user',
  '/api/character',
  '/api/bank',
  '/api/inventory',
  '/api/house',
  '/api/job'
];

// Routes that don't require authentication (public routes)
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/refresh',
  '/api/auth/verify-email',
  '/api/auth/forgot-password'
];

// Check if route requires authentication
const requiresAuth = (pathname) => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

// Check if route is public
const isPublicRoute = (pathname) => {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
};

// Routes that authenticated users shouldn't access
const AUTH_RESTRICTED_ROUTES = ['/login', '/signup'];

const isAuthRestrictedRoute = (pathname) => {
  return AUTH_RESTRICTED_ROUTES.some(route => pathname === route);
};

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  if (pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Handle page routes (non-API)
  if (!pathname.startsWith('/api/')) {
    // Check if authenticated user is trying to access login/signup
    if (isAuthRestrictedRoute(pathname)) {
      const token = request.cookies.get('token')?.value;
      if (token && hasValidTokenFormat(token)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }


  try {
    if (needsCSRFProtection(pathname, method)) {
      console.log('🛡️  Checking CSRF protection...');
      try {
        requireCSRF(request);
        console.log('✅ CSRF validation passed');
      } catch (error) {
        console.log('❌ CSRF validation failed:', error.message);
        return NextResponse.json(
          { 
            success: false, 
            error: 'CSRF protection failed',
            code: 'CSRF_INVALID'
          }, 
          { status: 403 }
        );
      }
    }

    // 2. Authentication Check
    if (requiresAuth(pathname)) {
      
      const token = request.cookies.get('token')?.value;
      
      if (!token) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          }, 
          { status: 401 }
        );
      }

      // Basic token format validation (detailed verification in route handlers)
      if (!hasValidTokenFormat(token)) {
        
        const response = NextResponse.json(
          { 
            success: false, 
            error: 'Invalid token format',
            code: 'TOKEN_INVALID'
          }, 
          { status: 401 }
        );
        
        response.cookies.delete('token');
        return response;
      }
      
      
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-has-token', 'true');
      
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      
      return response;
    }

    if (isPublicRoute(pathname) && ['POST'].includes(method)) {
      const response = NextResponse.next();
      
      // Set CSRF token for future requests
      if (!request.cookies.get('csrf-token')?.value) {
        setCSRFToken(response);
      }
      
      return response;
    }

    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        code: 'MIDDLEWARE_ERROR'
      }, 
      { status: 500 }
    );
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
