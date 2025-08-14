'use client';

import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {Profile} from "@/lib/types";
import {Button} from "@heroui/button";
import {useState} from "react";
import EditProfileForm from "@/app/profiles/[id]/EditProfileForm";
import {Avatar} from "@heroui/avatar";
import {Divider} from "@heroui/divider";

type Props = {
    profile: Profile
    currentUserProfile: boolean
}

export default function ProfileDetailed({profile, currentUserProfile}: Props) {
    const [editMode, setEditMode] = useState(false);
    return (
        <Card>
            <CardHeader className='text-3xl font-semibold flex justify-between'>
                <div className='flex items-center gap-3'>
                    <Avatar className='h-30 w-30' color='secondary' />
                    <span>{profile.displayName}</span>
                </div>
                {currentUserProfile &&
                    <Button
                        onPress={() => setEditMode(prev => !prev)}
                        variant='bordered'
                    >
                        {editMode ? 'Cancel' : 'Edit profile'}
                    </Button>}
            </CardHeader>
            <Divider />
            <CardBody>
                {editMode ? (
                    <EditProfileForm profile={profile} setEditMode={setEditMode} />
                ) : (
                    <p>{profile?.description || 'No profile description added yet'}</p>
                )}
            </CardBody>
            <CardFooter className='text-xl font-semibold'>
                Reputation score: {profile.reputation}
            </CardFooter>
        </Card>
    );
}