'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Keep for description
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

// --- TipTap Imports ---
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

// --- Icons for toolbar buttons ---
import {
  Bold, Italic, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, Link as LinkIcon, Image as ImageIcon,
  Palette
} from 'lucide-react';

// --- Rich Text Editor Toolbar Component (Copied from admin/articles) ---
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

export default function PublishArticlePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Remove content state, editor will manage it
  // const [content, setContent] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- IMPORTANT: Replace with your actual author ID logic ---
  const hardcodedAuthorId = '60d5ec49f5d7a438e8f8d6a5'; // Replace with a valid ObjectId
  // -----------------------------------------------------------

  // --- Initialize TipTap Editor ---
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Add any StarterKit specific configurations if needed
      }),
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your full article content here...',
        emptyEditorClass: 'is-editor-empty',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: '', // Initial content is empty
    editorProps: {
      attributes: {
        // Apply prose styles for better typography within the editor
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none w-full',
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // --- Get content from editor ---
    const content = editor ? editor.getHTML() : '';

    // Basic validation
    // Check editor content instead of state
    if (!title.trim() || !description.trim() || !content.trim() || content === '<p></p>') { 
      setError('Title, Description, and Content are required.');
      setIsSubmitting(false);
      return;
    }

    if (!hardcodedAuthorId) {
        setError('Author ID is missing. Cannot submit article.');
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch('/api/student-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content, // Send HTML content from editor
          author: hardcodedAuthorId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit article');
      }

      // Clear form and show success message
      setTitle('');
      setDescription('');
      // --- Clear editor content ---
      if (editor) {
        editor.commands.setContent('');
      }
      setSuccess('Article submitted successfully for review!');
      
    } catch (err: unknown) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'An error occurred while submitting the article'
      );
      console.error('Error submitting article:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl"> {/* Increased max-width */}
      <h1 className="text-3xl font-bold mb-8 text-center">Submit Your Article</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert variant="default" className="mb-6 bg-green-100 border-green-400 text-green-700">
           <Terminal className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title</Label>
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
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description (1-2 sentences)"
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>
          
          {/* --- Replace Textarea with Editor --- */}
          <div>
            <Label htmlFor="content" className="text-sm font-medium text-gray-700">Content</Label>
            <div className="mt-1 border border-gray-300 rounded overflow-hidden">
              <EditorToolbar editor={editor} />
              <EditorContent 
                editor={editor} 
                className="min-h-[350px] p-4 focus:outline-none bg-white w-full" 
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Use the toolbar above to format your content.</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            disabled={isSubmitting || !editor} // Disable if editor not ready
          >
            {isSubmitting ? 'Submitting...' : 'Submit Article'}
          </Button>
        </form>
      </div>
    </div>
  );
}