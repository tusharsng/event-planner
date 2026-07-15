import { auth } from '@/lib/auth/server';

export default auth.middleware({
  // Automatically sends unauthenticated users here
  loginUrl: '/auth/sign-in', 
});

export const config = {
  matcher: [
    // Define all route paths you want to safeguard
    '/dashboard/:path*',
    '/events/:path*'
  ],
};