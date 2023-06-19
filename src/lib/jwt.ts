import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { env } from '@/env.mjs';

type Token = JWTPayload;

export async function sign(payload: Token): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60; // one hour

    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(env.TOKEN_KEY));
}

export async function verify(token: string): Promise<Token | boolean> {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(env.TOKEN_KEY));
    if (!payload || !payload.id || !payload.exp || payload.exp < Date.now() / 1000) {
        return false;
    }
    return payload;
}
