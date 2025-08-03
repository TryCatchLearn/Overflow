import ErrorButtons from "@/app/session/ErrorButtons";
import AuthTestButton from "@/app/session/AuthTestButton";
import {auth} from "@/auth";
import {Snippet} from "@heroui/snippet";

export default async function Page() {
    const session = await auth();
    
    return (
        <div className="px-6">
            <div className='text-center'>
                <h3 className='text-3xl'>Session dashboard</h3>
            </div>
            
            <Snippet
                symbol=''
                color='primary'
                classNames={{
                    base: 'w-full mt-4',
                    pre: 'text-wrap whitespace-pre-wrap break-all'
                }}
            >
                {JSON.stringify(session, null, 2)}
            </Snippet>
            
            <div className='flex items-center gap-3 justify-center mt-6'>
                <ErrorButtons />
                <AuthTestButton />
            </div>
        </div>
        

    );
}