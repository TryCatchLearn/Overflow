import {Question} from "@/lib/types";
import {Button} from "@heroui/button";
import Link from "next/link";
import {fuzzyTimeAgo} from "@/lib/util";

type Props = {
    question: Question;
}

export default function QuestionDetailedHeader({ question }: Props) {
    return (
        <div className='flex flex-col w-full border-b gap-4 pb-4 px-6'>
            <div className='flex justify-between gap-4'>
                <div className='text-3xl font-semibold first-letter:uppercase'>
                    {question.title}
                </div>
                <Button
                    as={Link}
                    href='/questions/ask'
                    color='secondary'
                    className='w-[20%]'
                >
                    Ask Question
                </Button>
            </div>
            <div className='flex items-center gap-6'>
                <div className='flex items-center gap-3'>
                    <span className='text-foreground-500'>Asked</span>
                    <span>{fuzzyTimeAgo(question.createdAt)}</span>
                </div>
                {question.updatedAt && (
                    <div className='flex items-center gap-3'>
                        <span className='text-foreground-500'>Modified</span>
                        <span>{fuzzyTimeAgo(question.updatedAt)}</span>
                    </div>
                )}
                <div className='flex items-center gap-3'>
                    <span className='text-foreground-500'>Viewed</span>
                    <span>{question.viewCount + 1} times</span>
                </div>
            </div>
        </div>
    );
}