import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from '@tiptap/extension-image'
import MenuBar from "@/components/rte/MenuBar";
import {useEffect, useRef} from "react";
import clsx from "clsx";
import {extractPublicIdsFromHtml} from "@/lib/util";

type Props = {
    onChange: (body: string) => void;
    onBlur: () => void;
    value: string;
    errorMessage?: string;
}

export default function RichTextEditor({ onChange, onBlur, value, errorMessage }: Props) {
    const prevPublicIds = useRef<string[]>([]);
    
    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: '',
        editorProps: {
            attributes: {
                class: clsx('w-full p-3 bg-default-100 rounded-xl min-h-60 prose ' +
                    'dark:prose-invert max-w-none dark:prose-pre:bg-primary-100', {
                    'bg-red-50 dark:bg-red-900/30': errorMessage
                })
            }
        },
        onBlur() {
            onBlur()
        },
        onUpdate({editor}) {
            const html = editor.getHTML();
            onChange(html);
            
            const currentPublicIds = extractPublicIdsFromHtml(html);
            const prev = prevPublicIds.current;
            
            const deleted = prev.filter(id => !currentPublicIds.includes(id));
            
            if (deleted.length > 0) {
                deleted.forEach(publicId => {
                    fetch('/api/delete-image', {
                        method: 'POST',
                        headers: {'Content-type': 'application/json'},
                        body: JSON.stringify(publicId)
                    }).then(() => console.log('deleted ' + publicId))
                })
            }
            
            prevPublicIds.current = currentPublicIds;
        },
        immediatelyRender: false
    });
    
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [editor, value]);
    
    return (
        <div>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
        
    );
}