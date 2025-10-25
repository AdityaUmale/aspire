'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, PenLine } from 'lucide-react';

// TipTap imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontSize from 'tiptap-extension-font-size';

// Icons for toolbar buttons
import { 
  Bold, Italic, 
  List, ListOrdered, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Palette, Type
} from 'lucide-react';

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

export default function AddArticlesPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize TipTap editor
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration issues
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
        placeholder: 'Start writing your article content here...',
        emptyEditorClass: 'is-editor-empty',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'listItem'],
      }),
      TextStyle,
      FontSize,
      Color,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-indigo lg:prose-lg max-w-none prose-headings:text-[#1a237e] prose-a:text-[#3949ab] hover:prose-a:text-[#0d1642] prose-strong:text-gray-800 focus:outline-none',
        style: 'outline: none;',
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // Get content from editor
    const content = editor ? editor.getHTML() : '';

    // Validate form fields
    if (!title.trim() || !description.trim() || !content.trim()) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content,
          author: '64f5f1c1b7c5d9e8a3b2a1d0' // Replace with a valid MongoDB ObjectId for testing
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create article');
      }

      // Clear form and show success message
      setTitle('');
      setDescription('');
      if (editor) {
        editor.commands.setContent('');
      }
      setSuccess('Article created successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the article');
      console.error('Error creating article:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="inline-flex items-center rounded-full border border-[#1a237e]/20 bg-white px-3 py-1 text-sm text-[#1a237e] shadow-sm mb-6">
        <span className="flex h-2 w-2 rounded-full bg-[#1a237e] mr-2"></span>
        Create New Article
      </div>
      
      <h1 className="text-2xl lg:text-3xl font-bold text-[#1a237e] mb-6">Add an Article</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-100/50 border-red-300/50 text-red-800 rounded-lg shadow-sm">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-100/50 border-green-300/50 text-green-800 rounded-lg shadow-sm">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white/90 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-xl border border-gray-200/60">
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
          <div>
            <Label htmlFor="title" className="text-[#1a237e] font-medium">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-[#1a237e] font-medium">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description"
              className="mt-1 border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="text-[#1a237e] font-medium">Content</Label>
            <div className="mt-1 border border-[#1a237e]/20 rounded-lg overflow-hidden shadow-sm">
              <EditorToolbar editor={editor} />
              <EditorContent 
                editor={editor} 
                className="min-h-[250px] lg:min-h-[350px] p-4 focus:outline-none bg-white" 
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Use the toolbar above to format your content.</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#1a237e] to-[#3949ab] hover:from-[#0d1642] hover:to-[#1a237e] text-white py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            <PenLine className="h-4 w-4" />
            {isSubmitting ? 'Creating Article...' : 'Create Article'}
          </Button>
        </form>
      </div>
    </div>
  );
}