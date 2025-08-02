import {Question} from "@/lib/types";
import VotingButtons from "@/app/questions/[id]/VotingButtons";
import QuestionFooter from "@/app/questions/[id]/QuestionFooter";

type Props = {
    question: Question;
}

export default function QuestionContent({question}: Props) {
    return (
        <div className='flex border-b pb-3 px-6'>
            <VotingButtons />
            <div className='flex flex-col'>
                <div
                    className='flex-1 mt-4 ml-6 prose dark:prose-invert max-w-none'
                    dangerouslySetInnerHTML={{ __html: question.content }}
                />
                <QuestionFooter question={question} />
            </div>

        </div>
    );
}