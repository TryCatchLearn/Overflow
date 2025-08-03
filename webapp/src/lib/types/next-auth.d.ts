// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {JWT} from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        accessToken: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        refreshToken: string;
        accessTokenExpires: number;
        error?: string;
    }
}