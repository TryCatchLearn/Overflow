import {Spinner} from "@heroui/spinner";

export default function Loading() {
    return (
        <div className='h-full flex items-center justify-center'>
            <Spinner color='secondary' label='Loading...' />
        </div>
    );
}