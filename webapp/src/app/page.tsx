import {AcademicCapIcon} from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div className='flex items-center h-[calc(100vh-160px)] justify-center'>
        <div className='flex flex-col justify-center items-center gap-5 text-5xl text-secondary font-bold'>
          <AcademicCapIcon className='h-96 w-96' />
          <div>Welcome to overflow!</div>
        </div>
    </div>
  );
}
