import {z} from "zod";
import {stripHtmlTags} from "@/lib/util";

const required = (name: string) => z.string().trim().min(1, 
    {message: `${name} is required`});

const contentField = z.union([z.string(),z.undefined()])
    .transform(value => value ?? '')
    .refine(value => value.trim().length > 0, {
        message: 'Content is required'
    })
    .refine(
        (value) => stripHtmlTags(value).length >= 10, {
            message: 'Content should be at least 10 characters'
        }
    )

export const questionSchema = z.object({
    title: required("Title"),
    content: contentField,
    tags: z.array(z.string(), {message: 'Select at least 1 tag'})
        .min(1, {message: 'Select at least 1 tag'})
        .max(5, {message: 'No more than 5 tags can be selected'})
});

export type QuestionSchema = z.input<typeof questionSchema> 