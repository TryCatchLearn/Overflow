'use server';

import {fetchClient} from "@/lib/fetchClient";
import {Tag} from "@/lib/types";

export async function getTags() {
    return fetchClient<Tag[]>('/tags', 'GET', {cache: 'force-cache', next: {revalidate: 3600}})
}