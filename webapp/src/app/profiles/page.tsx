import ProfilesList from "@/app/profiles/ProfilesList";
import {getUserProfiles} from "@/lib/actions/profile-actions";
import {handleError} from "@/lib/util";

type SearchParams = Promise<{sortBy?: string}>

export default async function Page({searchParams}: {searchParams: SearchParams}) {
    const {sortBy} = await searchParams;
    const {data: profiles, error} = await getUserProfiles(sortBy);

    if (error) handleError(error);
    if (!profiles) return;

    return (
        <div className="flex flex-col gap-3 px-6">
            <h3 className='text-3xl font-semibold'>User table</h3>
            <ProfilesList profiles={profiles} />
        </div>
    );
}