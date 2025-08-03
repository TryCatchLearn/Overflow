import {Question} from "@/lib/types";
import {Chip} from "@heroui/chip";
import Link from "next/link";
import {Avatar} from "@heroui/avatar";
import {timeAgo} from "@/lib/util";

type Props = {
    question: Question
}

export default function QuestionFooter({ question }: Props) {
    return (
        <div className='flex justify-between mt-2'>
            <div className='flex flex-col self-end'>
                <div className='flex gap-2'>
                    {question.tagSlugs.map(tag => (
                        <Chip
                            as={Link}
                            variant='bordered'
                            href={`/questions?tag=${tag}`}
                            key={tag}
                        >
                            {tag}
                        </Chip>
                    ))}
                </div>
            </div>
            
            <div className='flex flex-col basis-2/5 bg-primary/10 px-3 py-2 gap-2 rounded-lg'>
                <span className='text-sm font-extralight'>asked {timeAgo(question.createdAt)}</span>
                <div className='flex items-center gap-3'>
                    <Avatar className='h-6 w-6' color='secondary' 
                            name={question.askerDisplayName.charAt(0)} />
                    <div className='flex flex-col items-center'>
                        <span>{question.askerDisplayName}</span>
                        <span className='self-start text-sm font-semibold'>42</span>
                    </div>
                </div>
            </div>
        </div>
    );
}