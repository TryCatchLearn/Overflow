'use client'

import {MagnifyingGlassIcon} from '@heroicons/react/24/solid'
import {Input} from "@heroui/input";
import {Tab, Tabs} from "@heroui/tabs";

export default function TagHeader() {
    const tabs = [
        {key: 'popular', label: 'Popular'},
        {key: 'name', label: 'Name'}
    ]

    return (
        <div className='flex flex-col w-full gap-4 pb-4'>
            <div className='flex flex-col items-start gap-3'>
                <div className='text-3xl font-semibold'>Tags</div>
                <p>A tag is a keyword or label that categorizes your question with other,
                    similar questions. Using the right tags makes it easier for others to find
                    and answer your question.</p>
            </div>
            <div className='flex items-center justify-between'>
                <Input
                    type="search"
                    className='w-fit'
                    required
                    placeholder="Search"
                    startContent={<MagnifyingGlassIcon className='h-6 text-neutral-500'/>}
                />

                <Tabs>
                    {tabs.map((item) => (
                        <Tab key={item.key} title={item.label}/>
                    ))}
                </Tabs>

            </div>
        </div>
    )
}