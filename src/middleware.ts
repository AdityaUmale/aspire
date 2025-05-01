import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Using 'jose' for edge-compatible JWT verification

// Function to get the JWT secret key
const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    // Ensure the secret is a Uint8Array
    return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const tokenCookie = request.cookies.get('token');
    const token = tokenCookie?.value;

    // Define static public paths that don't require authentication
    const staticPublicPaths = ['/signin', '/api/signin', '/'];

    // Allow requests to static public paths
    if (staticPublicPaths.some(path => pathname === path)) {
        return NextResponse.next();
    }

    // Allow requests to specific public pages and their subpaths
    if (
        pathname.startsWith('/publish-article') || 
        pathname.startsWith('/student-articles') ||
        pathname.startsWith('/articles') // Add articles path
    ) {
        return NextResponse.next();
    }

    // If trying to access a protected path without a token, redirect to signin
    if (!token) {
        // This check might be redundant now but safe to keep
        if (pathname === '/') {
             return NextResponse.next();
        }
        const url = request.nextUrl.clone();
        url.pathname = '/signin';
        // Add redirect query param if needed: url.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(url);
    }

    // Verify the token
    try {
        const secretKey = getJwtSecretKey();
        // Verify the JWT using jose, which works in Edge Runtime
        await jwtVerify(token, secretKey);

        // Token is valid, allow the request to proceed
        return NextResponse.next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        // Token is invalid or expired, clear the cookie and redirect to signin
        const url = request.nextUrl.clone();
        url.pathname = '/signin';
        const response = NextResponse.redirect(url);
        // Clear the invalid token cookie
        response.cookies.delete('token');
        return response;
    }
}

// Configure the matcher to specify which routes the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api routes that shouldn't be protected by default (adjust if needed)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - The signin page itself to avoid redirect loops
         * - The course API route
         * - The student article API route (including dynamic paths)
         * - The main article API route (including dynamic paths)
         */
        // Add api/course, api/student-article, and api/article to the negative lookahead
        '/((?!api/public|api/course|api/student-article|api/article|_next/static|_next/image|favicon.ico|signin).*)',
        // Explicitly include /admin and its subpaths if the above pattern is too broad or complex
        // '/admin/:path*',
    ],
};