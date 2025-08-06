import {getQuestionById} from "@/lib/actions/question-actions";
import {notFound} from "next/navigation";
import QuestionDetailedHeader from "@/app/questions/[id]/QuestionDetailedHeader";
import QuestionContent from "@/app/questions/[id]/QuestionContent";
import AnswerContent from "@/app/questions/[id]/AnswerContent";
import AnswersHeader from "@/app/questions/[id]/AnswersHeader";
import AnswerForm from "@/app/questions/[id]/AnswerForm";

type Params = Promise<{id: string}>

export default async function QuestionDetailedPage({params}: {params: Params}) {
    const {id} = await params;
    const {data: question, error} = await getQuestionById(id);
    
    if (error) throw error;
    if (!question) return notFound();
    
    return (
        <div className='w-full'>
            <QuestionDetailedHeader question={question} />
            <QuestionContent question={question} />
            {question.answers.length > 0 && (
                <AnswersHeader answerCount={question.answers.length} />
            )}
            {question.answers.map(answer => (
                <AnswerContent answer={answer} key={answer.id} />
            ))}
            <AnswerForm questionId={question.id} />
        </div>
    );
}