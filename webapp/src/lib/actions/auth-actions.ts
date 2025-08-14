'use server';

import {fetchClient} from "@/lib/fetchClient";
import {auth} from "@/auth";
import {User} from "next-auth";

export async function testAuth() {
    return fetchClient<string>(`/test/auth`, 'GET')
}

export async function getCurrentUser(): Promise<User> {
    const session = await auth();
    return session?.user ?? null;
}