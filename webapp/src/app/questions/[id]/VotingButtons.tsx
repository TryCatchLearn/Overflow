import {Button} from "@heroui/button";
import {ArrowDownCircleIcon, ArrowUpCircleIcon, CheckIcon} from "@heroicons/react/24/outline";

type Props = {
    accepted?: boolean;
}

export default function VotingButtons({accepted}: Props) {
    return (
        <div className='flex-shrink-0 flex flex-col gap-3 items-center justify-start mt-4'>
            <Button
                isIconOnly
                variant='light'
            >
                <ArrowUpCircleIcon className='w-12' />
            </Button>
            <span className='text-xl font-semibold'>0</span>
            <Button
                isIconOnly
                variant='light'
            >
                <ArrowDownCircleIcon className='w-12' />
            </Button>
            {accepted && (
                <Button
                    isIconOnly
                    variant='light'
                >
                    <CheckIcon className='size-12 text-success' strokeWidth={4} />
                </Button>
            )}
        </div>
    );
}