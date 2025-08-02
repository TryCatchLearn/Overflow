import {Answer} from "@/lib/types";
import VotingButtons from "@/app/questions/[id]/VotingButtons";
import AnswerFooter from "@/app/questions/[id]/AnswerFooter";

type Props = {
    answer: Answer;
}

export default function AnswerContent({answer}: Props) {
    return (
        <div className='flex border-b pb-3 px-6'>
            <VotingButtons accepted={answer.accepted} />
            <div className='flex flex-col'>
                <div
                    className='flex-1 mt-4 ml-6 prose max-w-none dark:prose-invert'
                    dangerouslySetInnerHTML={{__html: answer.content}}
                />
                <AnswerFooter answer={answer} />
            </div>

        </div>
    );
}