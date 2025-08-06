import {Editor} from "@tiptap/core";
import {useEditorState} from "@tiptap/react";
import {BoldIcon, CodeBracketIcon, ItalicIcon, LinkIcon, PhotoIcon, StrikethroughIcon} from "@heroicons/react/20/solid";
import {Button} from "@heroui/button";
import {CldUploadButton, CloudinaryUploadWidgetResults} from "next-cloudinary";
import {errorToast} from "@/lib/util";

type Props = {
    editor: Editor | null;
}

export default function MenuBar({editor}: Props) {
    const editorState = useEditorState({
        editor,
        selector: ({editor}) => {
            if (!editor) return null;
            
            return {
                isBold: editor.isActive('bold'),
                isItalic: editor.isActive('italic'),
                isStrike: editor.isActive('strike'),
                isCodeBlock: editor.isActive('codeBlock'),
                isLink: editor.isActive('link'),
            }
        }
    })
    
    if (!editor || !editorState) return null;
    
    const onUploadImage = (result: CloudinaryUploadWidgetResults) => {
        if (result.info && typeof result.info === "object") {
            editor.chain().focus().setImage({src: result.info.secure_url}).run();
        } else {
            errorToast({message: 'Problem adding image'});
        }
    }
    
    const options = [
        {
            icon: <BoldIcon className='w-5 h-5' />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: editorState.isBold
        },
        {
            icon: <ItalicIcon className='w-5 h-5' />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed: editorState.isItalic
        },
        {
            icon: <StrikethroughIcon className='w-5 h-5' />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            pressed: editorState.isStrike
        },
        {
            icon: <CodeBracketIcon className='w-5 h-5' />,
            onClick: () => editor.chain().focus().toggleCodeBlock().run(),
            pressed: editorState.isCodeBlock
        },
        {
            icon: <LinkIcon className='w-5 h-5' />,
            onClick: () => editor.chain().focus().toggleLink().run(),
            pressed: editorState.isLink
        },
    ]
    
    return (
        <div className='rounded-md space-x-1 pb-1 z-50'>
            {options.map((option, index) => (
                <Button
                    key={index}
                    type='button'
                    radius='sm'
                    size='sm'
                    isIconOnly
                    color={option.pressed ? 'primary' : 'default'}
                    onPress={option.onClick}
                >
                    {option.icon}
                </Button>
            ))}
            <Button
                isIconOnly
                size='sm'
                as={CldUploadButton}
                options={{maxFiles: 1}}
                onSuccess={onUploadImage}
                signatureEndpoint='/api/sign-image'
                uploadPreset='overflow'
            >
                <PhotoIcon className='w-5 h-5' />
            </Button>
        </div>
    );
}