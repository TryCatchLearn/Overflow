import {getProfileById} from "@/lib/actions/profile-actions";
import {notFound} from "next/navigation";
import {handleError} from "@/lib/util";
import ProfileDetailed from "@/app/profiles/[id]/ProfileDetailed";
import {getCurrentUser} from "@/lib/actions/auth-actions";

type Params = Promise<{id: string}>
export default async function Page({params}: {params: Params}) {
    const currentUser = await getCurrentUser();
    const {id} = await params;
    const {data: profile, error} = await getProfileById(id);
    const currentUserProfile = currentUser?.id === id;

    if (error) handleError(error);
    if (!profile) return notFound()

    return (
        <div className="px-6 flex flex-col gap-3">
            <h3 className='text-3xl font-semibold'>Profile details</h3>
            <ProfileDetailed
                profile={profile}
                currentUserProfile={currentUserProfile}
            />
        </div>
    );
}