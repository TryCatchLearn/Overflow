'use client';

import {useTagStore} from "@/lib/hooks/useTagStore";
import {Form} from "@heroui/form";
import {Input} from "@heroui/input";
import {Select, SelectItem} from "@heroui/select";
import {Button} from "@heroui/button";
import {Controller, useForm} from "react-hook-form";
import {questionSchema, QuestionSchema} from "@/lib/schemas/questionSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import clsx from "clsx";
import {useRouter} from "next/navigation";
import {postQuestion, updateQuestion} from "@/lib/actions/question-actions";
import {handleError} from "@/lib/util";
import {Question} from "@/lib/types";
import {useEffect, useTransition} from "react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import('@/components/rte/RichTextEditor'), {ssr: false});

type Props = {
    questionToUpdate?: Question
}

export default function QuestionForm({questionToUpdate}: Props) {
    const [pending, startTransition] = useTransition();
    const tags = useTagStore(state => state.tags);
    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: {isSubmitting, isValid, errors}
    } = useForm<QuestionSchema>({
        resolver: zodResolver(questionSchema),
        mode: 'onTouched'
    });
    const router = useRouter();

    useEffect(() => {
        if (questionToUpdate) reset({
            ...questionToUpdate,
            tags: questionToUpdate.tagSlugs
        })
    }, [questionToUpdate, reset]);

    const onSubmit = (data: QuestionSchema) => {
        startTransition(async () => {
            if (questionToUpdate) {
                const {error} = await updateQuestion(data, questionToUpdate.id);
                if (error) handleError(error);
                router.push(`/questions/${questionToUpdate.id}`);
            } else {
                const {data: question, error} = await postQuestion(data);
                if (error) handleError(error);
                if (question) router.push(`/questions/${question.id}`);
            }
        })
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 p-6 shadow-xl bg-white dark:bg-black'>
            <div className='flex flex-col gap-3 w-full'>
                <h3 className='text-2xl font-semibold'>Title</h3>
                <Input
                    {...register('title')}
                    type='text'
                    className='w-full'
                    label='Be specific and imagine you are asking a question to another person'
                    labelPlacement='outside-top'
                    placeholder='e.g how would you truncate text in tailwind'
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                />
            </div>
            <div className='flex flex-col gap-3 w-full'>
                <h3 className='text-2xl font-semibold'>Body</h3>
                <Controller
                    control={control}
                    name='content'
                    render={({field: {onChange, onBlur, value}, fieldState}) => (
                        <>
                            <p className={clsx('text-sm', {
                                'text-danger': fieldState.error?.message
                            })}>
                                Include all the information someone would need to answer the question
                            </p>
                            <RichTextEditor
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value || ''}
                                errorMessage={fieldState.error?.message}
                            />
                            {fieldState.error?.message && (
                                <span className='text-xs text-danger -mt-1'>
                                    {fieldState.error.message}
                                </span>
                            )}
                        </>
                    )}
                />
            </div>
            <div className='flex flex-col gap-3 w-full'>
                <h3 className='text-2xl font-semibold'>Tags</h3>
                <p className='text-sm'>Add up to 5 tags to describe what your question is about</p>
                {tags.length > 0 &&
                <Controller
                    name='tags'
                    control={control}
                    render={({field, fieldState}) => (
                        <Select
                            className='w-full'
                            label='Select 1-5 tags'
                            selectionMode='multiple'
                            isClearable
                            disallowEmptySelection
                            items={tags}
                            onBlur={field.onBlur}
                            selectedKeys={field.value ?? []}
                            onSelectionChange={(keys) => field.onChange(Array.from(keys))}
                            isInvalid={fieldState.invalid}
                            errorMessage={fieldState.error?.message}
                        >
                            {(tag) => <SelectItem key={tag.id}>{tag.name}</SelectItem>}
                        </Select>
                    )}

                />}

            </div>

            <Button
                isLoading={isSubmitting || pending}
                isDisabled={!isValid || pending}
                type='submit'
                color='primary'
                className='w-fit'>{questionToUpdate ? 'Update' : 'Post'} your question</Button>
        </Form>
    );
}