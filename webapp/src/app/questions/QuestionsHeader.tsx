'use client';

import {Button} from "@heroui/button";
import Link from "next/link";
import {Tab, Tabs} from "@heroui/tabs";
import {useTagStore} from "@/lib/hooks/useTagStore";
import {useRouter, useSearchParams} from "next/navigation";
import {Key} from "react";

type Props = {
    tag?: string;
    total: number;
}

export default function QuestionsHeader({tag, total}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedTag = useTagStore(state => state.getTagBySlug(tag ?? ''))
    const tabs = [
        {key: 'newest', label: 'Newest'},
        {key: 'active', label: 'Active'},
        {key: 'unanswered', label: 'Unanswered'},
    ]
    
    const selected = searchParams.get('sort') ?? 'newest';
    
    const handleTabChange = (tab: Key) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', tab.toString());
        router.push(`?${params.toString()}`);
    }
    
    return (
        <div className='flex flex-col w-full border-b gap-4 pb-4'>
            <div className='flex justify-between px-6'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='text-3xl font-semibold'>
                        {tag ? `[${tag}]` : 'Newest Questions'}
                    </div>
                    <p className='font-light'>{selectedTag?.description}</p>
                </div>
                
                <Button as={Link} href='/questions/ask' color='secondary'>
                    Ask Question
                </Button>
            </div>
            <div className='flex justify-between px-6 items-center'>
                <div>{total} {total === 1 ? 'Question' : 'Questions'}</div>
                <div className='flex items-center'>
                    <Tabs
                        selectedKey={selected}
                        onSelectionChange={handleTabChange}
                    >
                        {tabs.map(item => (
                            <Tab key={item.key} title={item.label} />
                        ))}
                    </Tabs>
                </div>
            </div>
        </div>
    );
}