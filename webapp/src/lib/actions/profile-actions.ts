'use server';

import {fetchClient} from "@/lib/fetchClient";
import {FetchResponse, Profile, TopUser, TopUserWithProfile} from "@/lib/types";
import {revalidatePath} from "next/cache";
import {EditProfileSchema} from "@/lib/schemas/editProfileSchema";

export async function getUserProfiles(sortBy?: string) {
    let url = '/profiles';
    if (sortBy) url += '?sortBy=' + sortBy;
    return fetchClient<Profile[]>(url, 'GET');
}

export async function getProfileById(id: string) {
    return fetchClient<Profile>(`/profiles/${id}`, 'GET');
}

export async function editProfile(id: string, profile: EditProfileSchema) {
    const result = await fetchClient<Profile>(`/profiles/edit`, 'PUT', {body: profile});

    revalidatePath(`/profiles/${id}`)

    return result;
}

export async function getTopUsers(): Promise<FetchResponse<TopUserWithProfile[]>> {
    const {data: users, error} = await fetchClient<TopUser[]>('/stats/top-users', 'GET', {
        cache: 'force-cache',
        next: {revalidate: 3600}
    });
    if (error) return {data: null, error: 
            {message: 'Problem getting users', status: 500}}
    
    const ids = [...new Set(users?.map(u => u.userId))]
    const qs = encodeURIComponent(ids.join(','));
    
    const {data: profiles, error: profilesError} = await fetchClient<Profile[]>(
        `/profiles/batch?ids=${qs}`, 'GET', {cache: 'force-cache', next: {revalidate: 3600}}
    );

    if (profilesError) return {data: null, error:
            {message: 'Problem getting profiles', status: 500}}
    
    const byId = new Map((profiles ?? []).map(p => [p.userId, p]));
    
    return {data: users?.map(u => ({
            ...u,
            profile: byId.get(u.userId)
        })) as TopUserWithProfile[]}
}