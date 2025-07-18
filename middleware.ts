import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simulate a logged-in state
const isLoggedIn = true;

export function middleware(request: NextRequest) {
  // All routes are open in this simplified version
  return NextResponse.next();
}

// No protected routes in the simplified version
export const config = {
  matcher: [],
};
