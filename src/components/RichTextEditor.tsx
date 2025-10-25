'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontSize from 'tiptap-extension-font-size';
import { 
  Bold, Italic, 
  List, ListOrdered, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Palette, Type
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// Rich Text Editor Toolbar Component
const EditorToolbar = ({ editor }: { editor: any }) => {
  const [currentFontSize, setCurrentFontSize] = useState('normal');

  // Update font size state when selection changes
  React.useEffect(() => {
    if (!editor) return;

    const updateFontSize = () => {
      const { fontSize } = editor.getAttributes('textStyle');
      if (fontSize) {
        setCurrentFontSize(fontSize);
      } else {
        setCurrentFontSize('normal');
      }
    };

    editor.on('selectionUpdate', updateFontSize);
    editor.on('transaction', updateFontSize);

    return () => {
      editor.off('selectionUpdate', updateFontSize);
      editor.off('transaction', updateFontSize);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-[#1a237e]/20 rounded-t p-2 bg-[#f8f9fa]">
      {/* Main toolbar */}
      <div className="flex flex-wrap gap-1 mb-2 overflow-x-auto">
        <div className="flex items-center mr-2 border-r pr-2 border-[#1a237e]/20">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 h-8 w-8 ${editor.isActive('bold') ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 h-8 w-8 ${editor.isActive('italic') ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center mr-2 border-r pr-2 border-[#1a237e]/20">
          <div className="relative inline-block">
            <select
              value={currentFontSize}
              onChange={(e) => {
                const size = e.target.value;
                setCurrentFontSize(size);
                if (size === 'normal') {
                  editor.chain().focus().unsetFontSize().run();
                } else {
                  editor.chain().focus().setFontSize(size).run();
                }
              }}
              className="h-8 px-2 pr-6 text-sm border border-[#1a237e]/20 rounded bg-white text-[#1a237e] hover:bg-[#e8eaf6]/70 focus:outline-none focus:ring-1 focus:ring-[#1a237e]/50 appearance-none cursor-pointer"
              title="Font Size"
            >
              <option value="normal">Normal</option>
              <option value="18px">Large</option>
              <option value="24px">XL</option>
              <option value="32px">XXL</option>
            </select>
            <Type className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-[#1a237e] pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center mr-2 border-r pr-2 border-[#1a237e]/20">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              if (editor) {
                editor.chain().focus().toggleBulletList().run();
              }
            }}
            className={`p-1 h-8 w-8 ${editor.isActive('bulletList') ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault();
              if (editor) {
                editor.chain().focus().toggleOrderedList().run();
              }
            }}
            className={`p-1 h-8 w-8 ${editor.isActive('orderedList') ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center mr-2 border-r pr-2 border-[#1a237e]/20">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1 h-8 w-8 ${editor.isActive({ textAlign: 'left' }) ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1 h-8 w-8 ${editor.isActive({ textAlign: 'center' }) ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1 h-8 w-8 ${editor.isActive({ textAlign: 'right' }) ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-1 h-8 w-8 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8 flex items-center justify-center text-[#1a237e] hover:bg-[#e8eaf6]/70"
              title="Text Color"
            >
              <Palette className="h-4 w-4" />
            </Button>
            <input 
              type="color"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Choose Text Color"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
        orderedList: {
          keepMarks: true,
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'ml-4',
          },
        },
        hardBreak: {
          keepMarks: false,
        },
      }),
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#3949ab] underline hover:text-[#0d1642]',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'listItem'],
      }),
      TextStyle,
      FontSize,
      Color,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-indigo lg:prose-lg max-w-none prose-headings:text-[#1a237e] prose-a:text-[#3949ab] hover:prose-a:text-[#0d1642] prose-strong:text-gray-800 focus:outline-none',
        style: 'outline: none;',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-[#1a237e]/20 rounded-lg overflow-hidden shadow-sm">
      <EditorToolbar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="min-h-[250px] lg:min-h-[350px] p-4 focus:outline-none bg-white" 
      />
    </div>
  );
}
