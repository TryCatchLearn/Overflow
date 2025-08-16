'use server';

import {fetchClient} from "@/lib/fetchClient";
import {Tag, TrendingTag} from "@/lib/types";

export async function getTags(sort?: string) {
    let url = '/tags';
    if (sort) url += '?sort=' + sort;
    
    return fetchClient<Tag[]>(url, 'GET', 
        {cache: 'force-cache', next: {revalidate: 3600}})
}

export async function getTrendingTags() {
    return fetchClient<TrendingTag[]>('/stats/trending-tags', 'GET', 
        {cache: 'force-cache', next: {revalidate: 3600}})
}