import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

export default async function proxy(request: NextRequest) {
  if (request.headers.has("Next-Action")) {
    return NextResponse.next();
  }

  // Automatically sends unauthenticated users here
  return auth.middleware({
    loginUrl: "/auth/sign-in",
  })(request);
}
export const config = {
  matcher: [
    // Define all route paths you want to safeguard
    '/dashboard/:path*',
    '/events/:path*'
  ],
};