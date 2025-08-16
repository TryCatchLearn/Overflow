import {getTopUsers} from "@/lib/actions/profile-actions";
import {handleError} from "@/lib/util";

export default async function TopUsers() {
    const {data: users, error} = await getTopUsers();
    
    if (error) handleError(error);
    
    return (
        <div className='bg-primary-50 p-6 rounded-2xl'>
            <h3 className='text-2xl text-secondary mb-5 text-center'>Most points this week</h3>
            <div className='flex flex-col px-6 gap-3'>
                {users?.map(u => (
                    <div className='flex justify-between items-center' key={u.userId}>
                        <div>{u.profile.displayName}</div>
                        <div>{u.delta}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}