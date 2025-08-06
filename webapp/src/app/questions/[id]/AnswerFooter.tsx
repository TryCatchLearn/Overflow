'use client';

import {Answer} from "@/lib/types";
import {Avatar} from "@heroui/avatar";
import {handleError, timeAgo} from "@/lib/util";
import { Button } from "@heroui/button";
import {User} from "next-auth";
import {useState, useTransition} from "react";
import {deleteAnswer} from "@/lib/actions/question-actions";
import {useAnswerStore} from "@/lib/hooks/useAnswerStore";

type Props = {
    answer: Answer;
    currentUser?: User | null;
}

export default function AnswerFooter({ answer, currentUser }: Props) {
    const [pending, startTransition] = useTransition();
    const [deleteTarget, setDeleteTarget] = useState<string>('');
    const setAnswer = useAnswerStore(state => state.setAnswer);
    const editableAnswer = useAnswerStore(state => state.answer);

    const handleDelete = () => {
        setDeleteTarget(answer.id);
        startTransition(async () => {
            const {error} = await deleteAnswer(answer.id, answer.questionId);
            if (error) handleError(error);
            setDeleteTarget('');
        })
    }
    
    return (
        <div className='flex justify-between mt-4'>
            <div className='flex items-center mt-auto'>
                {currentUser?.id === answer.userId &&
                <>
                    <Button
                        isDisabled={!!editableAnswer}
                        onPress={() => {
                            setAnswer(answer);
                            setTimeout(() => {
                                document.getElementById('answer-form')?.scrollIntoView({
                                    behavior: 'smooth' });
                            }, 100);
                        }}
                        size='sm'
                        variant='light'
                        color='primary'
                    >Edit</Button>
                    <Button
                        isLoading={pending && answer.id === deleteTarget}
                        onPress={handleDelete}
                        size='sm'
                        variant='light'
                        color='danger'
                    >Delete</Button>
                </>}
            </div>

            <div className='flex flex-col basis-2/5 bg-primary/10 px-3 py-2 gap-2 rounded-lg'>
                <span className='text-sm font-extralight'>answered {timeAgo(answer.createdAt)}</span>
                <div className='flex items-center gap-3'>
                    <Avatar className='h-6 w-6' color='secondary'
                            name={answer.userDisplayName.charAt(0)} />
                    <div className='flex flex-col items-center'>
                        <span>{answer.userDisplayName}</span>
                        <span className='self-start text-sm font-semibold'>42</span>
                    </div>
                </div>
            </div>
        </div>
    );
}