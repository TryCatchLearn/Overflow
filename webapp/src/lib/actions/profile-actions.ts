'use server';

import {fetchClient} from "@/lib/fetchClient";
import {Profile} from "@/lib/types";
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