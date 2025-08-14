import {z} from "zod";

const required = (name: string) => z.string().trim().min(1,
    {message: `${name} is required`});

export const editProfileSchema = z.object({
    displayName: required('Display name'),
    description: required('Description'),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;