import {Question} from "@/lib/types";
import Link from "next/link";
import {Chip} from "@heroui/chip";
import {Avatar} from "@heroui/avatar";
import clsx from "clsx";
import {CheckIcon} from "@heroicons/react/24/outline";
import {timeAgo} from "@/lib/util";

type Props = {
    question: Question;
}

export default function QuestionCard({question}: Props) {
    return (
        <div className='flex gap-6 px-6'>
            <div className='flex flex-col items-end text-sm gap-3 min-w-[6rem]'>
                <div>{question.votes} {question.votes === 1 ? 'vote' : 'votes'}</div>
                <div
                    className={clsx('flex justify-end rounded', {
                        'border-2 border-success': question.answerCount > 0,
                        'bg-success-600 text-default-50': question.hasAcceptedAnswer
                    })}
                >
                    <span
                        className={clsx('flex items-center gap-2', {
                            'p-1': question.answerCount > 0
                        })}
                    >
                        {question.hasAcceptedAnswer && (
                            <CheckIcon className='h-4 w-4' strokeWidth={4}/>
                        )}
                        {question.answerCount} {question.answerCount === 1 ? 'answer' : 'answers'}
                    </span>
                    
                </div>
                <div>{question.viewCount} {question.viewCount === 1 ? 'view' : 'views'}</div>
            </div>
            <div className='flex flex-1 justify-between min-h-[8rem]'>
                <div className='flex flex-col gap-2'>
                    <Link 
                        href={`/questions/${question.id}`}
                        className='text-primary font-semibold hover:underline first-letter:uppercase'
                    >
                        {question.title}
                    </Link>
                    <div
                        className='line-clamp-2'
                        dangerouslySetInnerHTML={{__html: question.content}}
                    />
                    <div className='flex justify-between pt-2'>
                        <div className='flex gap-2'>
                            {question.tagSlugs.map(slug => (
                                <Chip
                                    key={slug}
                                    variant='bordered'
                                    as={Link}
                                    href={`/questions?tag=${slug}`}
                                >
                                    {slug}
                                </Chip>
                            ))}
                        </div>
                        
                        <div className='text-sm flex items-center gap-2'>
                            <Avatar 
                                className='h-6 w-6'
                                color='secondary'
                                name={question.askerDisplayName.charAt(0)}
                            />
                            <Link href={`/profiles/${question.askerId}`}>
                                {question.askerDisplayName}
                            </Link>
                            <span>asked {timeAgo(question.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}