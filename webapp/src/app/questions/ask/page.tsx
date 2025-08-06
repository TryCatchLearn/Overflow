import QuestionForm from "@/app/questions/ask/QuestionForm";

export default function Page() {
    return (
        <div className='px-6'>
            <h3 className='text-3xl font-semibold pb-3'>Ask a public question</h3>
            <QuestionForm />
        </div>
    );
}