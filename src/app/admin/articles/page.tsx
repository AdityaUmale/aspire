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

// Icons for toolbar buttons
import { 
  Bold, Italic, Heading2, Heading3, 
  List, ListOrdered, Quote, Minus, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Link as LinkIcon, Image as ImageIcon,
  Palette
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1 h-8 w-8 ${editor.isActive('heading', { level: 2 }) ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1 h-8 w-8 ${editor.isActive('heading', { level: 3 }) ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center mr-2 border-r pr-2 border-[#1a237e]/20">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 h-8 w-8 ${editor.isActive('bulletList') ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1 h-8 w-8 ${editor.isActive('orderedList') ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1 h-8 w-8 ${editor.isActive('blockquote') ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1 h-8 w-8 text-[#1a237e] hover:bg-[#e8eaf6]/70"
            title="Divider"
          >
            <Minus className="h-4 w-4" />
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-1 h-8 w-8 ${editor.isActive('link') ? 'bg-[#e8eaf6]' : ''} text-[#1a237e] hover:bg-[#e8eaf6]/70`}
            title="Add Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowImageInput(!showImageInput)}
            className="p-1 h-8 w-8 text-[#1a237e] hover:bg-[#e8eaf6]/70"
            title="Add Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          
          <div className="relative ml-1">
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

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center mt-2 mb-1 space-x-2">
          <Input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="h-8 text-sm border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
          />
          <Button 
            type="button" 
            size="sm" 
            onClick={addLink}
            className="h-8 bg-[#1a237e] hover:bg-[#0d1642] text-white"
          >
            Add Link
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => setShowLinkInput(false)}
            className="h-8 border-[#1a237e]/20 text-[#1a237e] hover:bg-[#e8eaf6]/70"
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
            className="h-8 text-sm border-[#1a237e]/20 focus:border-[#1a237e] focus:ring-[#1a237e]/20"
          />
          <Button 
            type="button" 
            size="sm" 
            onClick={addImage}
            className="h-8 bg-[#1a237e] hover:bg-[#0d1642] text-white"
          >
            Add Image
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => setShowImageInput(false)}
            className="h-8 border-[#1a237e]/20 text-[#1a237e] hover:bg-[#e8eaf6]/70"
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

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
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
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-indigo lg:prose-lg max-w-none prose-headings:text-[#1a237e] prose-a:text-[#3949ab] hover:prose-a:text-[#0d1642] prose-strong:text-gray-800 focus:outline-none',
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