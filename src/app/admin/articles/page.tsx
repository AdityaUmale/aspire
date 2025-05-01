'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// TipTap imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
// Remove Underline import
// import Underline from '@tiptap/extension-underline'; 
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

// Icons for toolbar buttons
import { 
  Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3, 
  List, ListOrdered, Quote, Minus, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Link as LinkIcon, Image as ImageIcon,
  Type, Palette
} from 'lucide-react';

// Rich Text Editor Toolbar Component
const EditorToolbar = ({ editor }: { editor: any }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-t p-2 bg-gray-50">
      {/* Main toolbar */}
      <div className="flex flex-wrap gap-1 mb-2">
        <div className="flex items-center mr-2 border-r pr-2 border-gray-300">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 h-8 w-8 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 h-8 w-8 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          {/* Remove the Underline Button */}
          {/* 
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              // Revert back to using the toggleUnderline chain command
              editor.chain().focus().toggleUnderline().run();
            }}
            className={`p-1 h-8 w-8 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          */}
        </div>

        <div className="flex items-center mr-2 border-r pr-2 border-gray-300">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1 h-8 w-8 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1 h-8 w-8 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center mr-2 border-r pr-2 border-gray-300">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 h-8 w-8 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1 h-8 w-8 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1 h-8 w-8 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1 h-8 w-8"
            title="Divider"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center mr-2 border-r pr-2 border-gray-300">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1 h-8 w-8 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1 h-8 w-8 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1 h-8 w-8 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-1 h-8 w-8 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}`}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-1 h-8 w-8 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowImageInput(!showImageInput)}
            className="p-1 h-8 w-8"
            title="Add Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          
          <div className="relative ml-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8 flex items-center justify-center"
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

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center mt-2 mb-1 space-x-2">
          <Input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="h-8 text-sm"
          />
          <Button 
            type="button" 
            size="sm" 
            onClick={addLink}
            className="h-8"
          >
            Add Link
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => setShowLinkInput(false)}
            className="h-8"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Image input */}
      {showImageInput && (
        <div className="flex items-center mt-2 mb-1 space-x-2">
          <Input
            type="url"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="h-8 text-sm"
          />
          <Button 
            type="button" 
            size="sm" 
            onClick={addImage}
            className="h-8"
          >
            Add Image
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => setShowImageInput(false)}
            className="h-8"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default function AddArticlesPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize TipTap editor without Underline
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // underline: false, // No longer needed as Underline extension is removed
      }),
      // Underline, // Remove Underline from extensions array
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article content here...',
        emptyEditorClass: 'is-editor-empty',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none',
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add an Article</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <div className="bg-white p-6 rounded shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-700 font-medium">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description"
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="text-gray-700 font-medium">Content</Label>
            <div className="mt-1 border border-gray-300 rounded overflow-hidden">
              <EditorToolbar editor={editor} />
              <EditorContent 
                editor={editor} 
                className="min-h-[350px] p-4 focus:outline-none bg-white" 
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Use the toolbar above to format your content.</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#1a237e] hover:bg-[#0d1642] text-white py-2 px-4 rounded transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Article...' : 'Create Article'}
          </Button>
        </form>
      </div>
    </div>
  );
}