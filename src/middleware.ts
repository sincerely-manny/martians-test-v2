/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from './lib/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('x-access-token')?.value;
    if (token) {
        const decoded = await verify(token);
        if (decoded) {
            return NextResponse.next();
        }
    }
    return NextResponse.redirect(new URL('/user/sign-in', request.url));
}

export const config = {
    matcher: ['/protected/:path*'],
};
