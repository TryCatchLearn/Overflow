// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, {DefaultSession} from 'next-auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {JWT} from 'next-auth/jwt';
import {DefaultUser} from "@auth/core/types";

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            displayName: string
            reputation: string
        } & DefaultUser['user']
        accessToken: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        refreshToken: string;
        accessTokenExpires: number;
        error?: string;
        user: {
            id: string;
            displayName: string;
            reputation: number;
        }
    }
}