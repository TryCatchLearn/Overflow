import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input, Textarea} from "@heroui/input";
import {Button} from "@heroui/button";
import {Profile} from "@/lib/types";
import {useTransition} from "react";
import {editProfile} from "@/lib/actions/profile-actions";
import {handleError, successToast} from "@/lib/util";
import {editProfileSchema, EditProfileSchema} from "@/lib/schemas/editProfileSchema";

type Props = {
    profile: Profile;
    setEditMode: (value: boolean) => void;
}

export default function EditProfileForm({profile, setEditMode}: Props) {
    const [pending, startTransition] = useTransition();
    const {register, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm<EditProfileSchema>({
        resolver: zodResolver(editProfileSchema),
        mode: 'onTouched',
        defaultValues: {
            displayName: profile.displayName,
            description: profile.description
        }
    })

    const onSubmit = (data: EditProfileSchema) => {
        startTransition(async () => {
            const {error} = await editProfile(profile.userId, data);
            if (error) handleError(error);
            successToast('Profile successfully updated');
            setEditMode(false);
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <Input
                {...register('displayName')}
                label='Display name'
                isInvalid={!!errors.displayName}
                errorMessage={errors.displayName?.message}
            />
            <Textarea
                {...register('description')}
                label='Description'
                rows={4}
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
            />
            <Button
                isLoading={isSubmitting || pending}
                isDisabled={isSubmitting || !isValid}
                color='secondary'
                className='w-fit'
                type='submit'
            >Submit</Button>
        </form>
    );
}