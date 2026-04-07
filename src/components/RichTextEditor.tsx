'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { mergeAttributes } from '@tiptap/core';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontSize from 'tiptap-extension-font-size';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import {
  Bold,
  Italic,
  List, ListOrdered, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, Palette, Type,
  ImagePlus, Link2, LoaderCircle, Trash2, MoveUp, MoveDown, Expand
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  stickyToolbar?: boolean;
  toolbarOffsetPx?: number;
}

type ImageAlign = 'left' | 'center' | 'right';

const getEditorCharacterCount = (editor?: Editor | null): number => {
  if (!editor) {
    return 0;
  }

  return Math.max(0, editor.state.doc.content.size - 2);
};

const parseWidthPercentage = (value?: string | number | null): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.min(100, Math.max(20, Math.round(value)));
  }

  if (!value) {
    return 100;
  }

  const rawValue = String(value).trim();
  const parsed = rawValue.endsWith('%')
    ? Number(rawValue.replace('%', ''))
    : Number(rawValue);

  if (!Number.isFinite(parsed)) {
    return 100;
  }

  return Math.min(100, Math.max(20, Math.round(parsed)));
};

const normalizeImageWidth = (value?: string | number | null): string => `${parseWidthPercentage(value)}%`;

const normalizeImageAlign = (value?: string | null): ImageAlign => {
  if (value === 'left' || value === 'right' || value === 'center') {
    return value;
  }
  return 'center';
};

const buildImageStyle = (width: string, align: ImageAlign): string => {
  const styleParts = [`width: ${width}`, 'max-width: 100%', 'height: auto'];

  if (align === 'left') {
    // Float left so following text can wrap alongside the image.
    styleParts.push(
      'float: left',
      'display: block',
      'clear: none',
      'margin-top: 0',
      'margin-right: 16px',
      'margin-bottom: 12px',
      'margin-left: 0'
    );
  } else if (align === 'right') {
    styleParts.push(
      'float: right',
      'display: block',
      'clear: none',
      'margin-top: 0',
      'margin-right: 0',
      'margin-bottom: 12px',
      'margin-left: 16px'
    );
  } else {
    // Center image as standalone block and clear any previous wrapped flow.
    styleParts.push(
      'float: none',
      'display: block',
      'clear: both',
      'margin-top: 24px',
      'margin-right: auto',
      'margin-bottom: 24px',
      'margin-left: auto'
    );
  }

  return styleParts.join('; ');
};

const ArticleImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: (element) => normalizeImageWidth(element.getAttribute('width') || element.style.width || '100%'),
      },
      align: {
        default: 'center',
        parseHTML: (element) => {
          const dataAlign = element.getAttribute('data-align');
          if (dataAlign === 'left' || dataAlign === 'right' || dataAlign === 'center') {
            return dataAlign;
          }

          const floatValue = element.style.float;
          if (floatValue === 'left' || floatValue === 'right') {
            return floatValue;
          }

          const marginLeft = element.style.marginLeft;
          const marginRight = element.style.marginRight;
          if (marginLeft === '0px' || marginLeft === '0') return 'left';
          if (marginRight === '0px' || marginRight === '0') return 'right';
          return 'center';
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const attributes = { ...HTMLAttributes } as Record<string, string>;
    const width = normalizeImageWidth(attributes.width);
    const align = normalizeImageAlign(attributes.align);
    delete attributes.width;
    delete attributes.align;
    delete attributes.style;

    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, attributes, {
        style: buildImageStyle(width, align),
        'data-align': align,
      }),
    ];
  },
});

const uploadImageFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });

  const payload = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !payload.url) {
    throw new Error(payload.error || 'Image upload failed');
  }

  return payload.url;
};

const moveSelectedImage = (editor: Editor, direction: 'up' | 'down') => {
  const { state, view } = editor;
  const selection = state.selection;

  if (!(selection instanceof NodeSelection) || selection.node.type.name !== 'image') {
    return;
  }

  const topLevelNodes: Array<{ pos: number; node: NodeSelection['node'] }> = [];
  state.doc.forEach((node, offset) => {
    topLevelNodes.push({ pos: offset, node });
  });

  const currentIndex = topLevelNodes.findIndex((entry) => entry.pos === selection.from);
  if (currentIndex === -1) {
    return;
  }

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= topLevelNodes.length) {
    return;
  }

  const current = topLevelNodes[currentIndex];
  const target = topLevelNodes[targetIndex];
  const tr = state.tr.delete(current.pos, current.pos + current.node.nodeSize);
  const insertPos =
    direction === 'up'
      ? target.pos
      : target.pos + target.node.nodeSize - current.node.nodeSize;

  tr.insert(insertPos, current.node);
  tr.setSelection(NodeSelection.create(tr.doc, insertPos));
  view.dispatch(tr.scrollIntoView());
  view.focus();
};

const focusTextBesideSelectedImage = (editor: Editor) => {
  const { state, view } = editor;
  const selection = state.selection;

  if (!(selection instanceof NodeSelection) || selection.node.type.name !== 'image') {
    return;
  }

  const paragraphType = state.schema.nodes.paragraph;
  if (!paragraphType) {
    return;
  }

  const imageEndPosition = selection.from + selection.node.nodeSize;
  let tr = state.tr;
  const nodeAfterImage = tr.doc.nodeAt(imageEndPosition);

  if (!nodeAfterImage || nodeAfterImage.type !== paragraphType) {
    tr = tr.insert(imageEndPosition, paragraphType.create());
  }

  tr = tr.setSelection(TextSelection.near(tr.doc.resolve(imageEndPosition + 1), 1));
  view.dispatch(tr.scrollIntoView());
  view.focus();
};

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  stickyToolbar = true,
  toolbarOffsetPx = 96,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFontSize, setCurrentFontSize] = useState('normal');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [editorRevision, setEditorRevision] = useState(0);

  const uploadAndInsertFiles = useCallback(async (files: File[], view: EditorView, startPosition?: number) => {
    if (files.length === 0) {
      return;
    }

    setIsUploadingImage(true);
    setImageUploadError(null);

    let insertPos = startPosition;

    try {
      for (const file of files) {
        const uploadedUrl = await uploadImageFile(file);
        const { state } = view;
        const imageNode = state.schema.nodes.image?.create({
          src: uploadedUrl,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          width: '100%',
          align: 'center',
        });

        if (!imageNode) {
          continue;
        }

        const position = typeof insertPos === 'number' ? insertPos : state.selection.from;
        const tr = state.tr.insert(position, imageNode);
        let nextPosition = position + imageNode.nodeSize;

        const paragraphNode = state.schema.nodes.paragraph?.create();
        if (paragraphNode) {
          tr.insert(nextPosition, paragraphNode);
          nextPosition += paragraphNode.nodeSize;
          tr.setSelection(TextSelection.create(tr.doc, nextPosition - 1));
        } else {
          tr.setSelection(NodeSelection.create(tr.doc, position));
        }

        view.dispatch(tr.scrollIntoView());
        insertPos = nextPosition;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to upload image';
      setImageUploadError(message);
    } finally {
      setIsUploadingImage(false);
    }
  }, []);

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
      ArticleImage.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'my-6 rounded-lg border border-gray-200 shadow-sm clear-none',
        },
      }),
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
        class: 'rich-text-editor prose prose-indigo lg:prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#1a237e] hover:prose-a:text-[#0d1642] prose-strong:text-gray-800 focus:outline-none min-h-[150px] cursor-text',
        style: 'outline: none;',
      },
      handlePaste: (view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((file) =>
          file.type.startsWith('image/')
        );
        if (files.length === 0) {
          return false;
        }

        event.preventDefault();
        void uploadAndInsertFiles(files, view);
        return true;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) {
          return false;
        }

        const files = Array.from(event.dataTransfer?.files ?? []).filter((file) =>
          file.type.startsWith('image/')
        );
        if (files.length === 0) {
          return false;
        }

        event.preventDefault();
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        void uploadAndInsertFiles(files, view, coordinates?.pos);
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const characterCount = getEditorCharacterCount(editor);

  // Sync external content reset (e.g. after form submission) into the editor
  useEffect(() => {
    if (editor && content === '' && editor.getHTML() !== '<p></p>') {
      editor.commands.clearContent();
    }
  }, [content, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const syncToolbarState = () => {
      const { fontSize } = editor.getAttributes('textStyle') as { fontSize?: string };
      setCurrentFontSize(fontSize || 'normal');
      setEditorRevision((value) => value + 1);
    };

    editor.on('selectionUpdate', syncToolbarState);
    editor.on('transaction', syncToolbarState);
    syncToolbarState();

    return () => {
      editor.off('selectionUpdate', syncToolbarState);
      editor.off('transaction', syncToolbarState);
    };
  }, [editor]);

  const selectedImage = (() => {
    if (!editor || !editor.isActive('image')) {
      return null;
    }

    // Trigger recompute when selection/transaction updates.
    void editorRevision;
    const attrs = editor.getAttributes('image') as { width?: string; align?: string };
    return {
      width: parseWidthPercentage(attrs.width),
      align: normalizeImageAlign(attrs.align),
    };
  })();

  const hasImageNode = (() => {
    if (!editor) {
      return false;
    }

    let found = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'image') {
        found = true;
        return false;
      }
      return true;
    });

    return found;
  })();

  const insertImageFromUrl = () => {
    if (!editor) {
      return;
    }

    const rawUrl = window.prompt('Paste image URL');
    if (!rawUrl) {
      return;
    }

    const url = rawUrl.trim();
    if (!url) {
      return;
    }

    const isRelativeUrl = url.startsWith('/');
    const isAbsoluteHttpUrl = /^https?:\/\//i.test(url);

    if (!isRelativeUrl && !isAbsoluteHttpUrl) {
      setImageUploadError('Use a valid URL starting with http(s):// or /.');
      return;
    }

    const altText = window.prompt('Alt text (optional)') || '';
    setImageUploadError(null);
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'image',
        attrs: {
          src: url,
          alt: altText.trim(),
          width: '100%',
          align: 'center',
        },
      })
      .run();
  };

  const handleImageFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) {
      return;
    }

    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) {
      return;
    }

    await uploadAndInsertFiles(files, editor.view);
    event.target.value = '';
  };

  return (
    <div className="w-full relative group">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleImageFileSelect}
      />

      <div
        className={cn(
          "p-2 md:p-2 bg-white backdrop-blur-md rounded-xl border border-gray-200 shadow-md mx-auto mb-4 w-max max-w-full transition-all duration-300 relative z-10",
          stickyToolbar && "sticky z-40"
        )}
        style={stickyToolbar ? { top: `${toolbarOffsetPx}px` } : undefined}
      >
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto px-1">
          <div className="flex items-center mr-2 border-r pr-2 border-gray-200">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1 h-8 w-8 ${editor?.isActive('bold') ? 'bg-[#1a237e]/10 text-[#1a237e] rounded-md' : 'rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1 h-8 w-8 ${editor?.isActive('italic') ? 'bg-[#1a237e]/10 text-[#1a237e] rounded-md' : 'rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center mr-2 border-r pr-2 border-gray-200">
            <div className="relative inline-block">
              <select
                value={currentFontSize}
                onChange={(event) => {
                  const size = event.target.value;
                  setCurrentFontSize(size);
                  if (!editor) {
                    return;
                  }

                  if (size === 'normal') {
                    editor.chain().focus().unsetFontSize().run();
                    return;
                  }

                  editor.chain().focus().setFontSize(size).run();
                }}
                className="h-8 px-2 pr-6 text-sm border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#1a237e]/30 font-medium appearance-none cursor-pointer"
                title="Font Size"
              >
                <option value="normal">Normal</option>
                <option value="18px">Large</option>
                <option value="24px">XL</option>
                <option value="32px">XXL</option>
              </select>
              <Type className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center mr-2 border-r pr-2 border-gray-200">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onMouseDown={(event) => {
                event.preventDefault();
                editor?.chain().focus().toggleBulletList().run();
              }}
              className={`p-1 h-8 w-8 ${editor?.isActive('bulletList') ? 'bg-[#1a237e]/10 text-[#1a237e] rounded-md' : 'rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onMouseDown={(event) => {
                event.preventDefault();
                editor?.chain().focus().toggleOrderedList().run();
              }}
              className={`p-1 h-8 w-8 ${editor?.isActive('orderedList') ? 'bg-[#1a237e]/10 text-[#1a237e] rounded-md' : 'rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center mr-2 border-r pr-2 border-gray-200">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              className={`p-1 h-8 w-8 ${editor?.isActive('textAlign', 'left') ? 'bg-[#1a237e]/10 text-[#1a237e] rounded-md' : 'rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              className={`p-1 h-8 w-8 ${editor?.isActive('textAlign', 'center') ? 'bg-[#1a237e]/10 text-[#1a237e] rounded-md' : 'rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              className={`p-1 h-8 w-8 ${editor?.isActive('textAlign', 'right') ? 'bg-[#1a237e]/10 text-[#1a237e] rounded-md' : 'rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
              className={`p-1 h-8 w-8 ${editor?.isActive('textAlign', 'justify') ? 'bg-[#1a237e]/10 text-[#1a237e] rounded-md' : 'rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              title="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center mr-2 border-r pr-2 border-gray-200">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="p-1 h-8 px-2.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-1.5"
              title="Upload Image"
            >
              <ImagePlus className="h-4 w-4" />
              <span className="text-xs font-medium">Image</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={insertImageFromUrl}
              className="p-1 h-8 w-8 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              title="Insert Image URL"
            >
              <Link2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center">
            <div className="relative" title="Text Color">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-1 h-8 px-2.5 flex items-center gap-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <Palette className="h-4 w-4" />
                <span className="text-xs font-medium">Color</span>
              </Button>
              <input
                type="color"
                onChange={(event) => editor?.chain().focus().setColor(event.target.value).run()}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Choose Text Color"
              />
            </div>
          </div>
        </div>

        {selectedImage && (
          <div className="flex flex-wrap items-center gap-2 border border-[#1a237e]/15 rounded-md p-2 bg-white">
            <div className="flex items-center gap-2 mr-2">
              <Expand className="h-3.5 w-3.5 text-[#1a237e]" />
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={selectedImage.width}
                onChange={(event) =>
                  editor?.chain().focus().updateAttributes('image', {
                    width: `${event.target.value}%`,
                  }).run()
                }
                className="w-28 accent-[#1a237e]"
                title="Resize image"
              />
              <span className="text-xs text-[#1a237e] min-w-[42px]">{selectedImage.width}%</span>
            </div>

            <div className="flex items-center border-l border-gray-100 pl-2 gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().updateAttributes('image', { align: 'left' }).run()}
                className={`p-1 h-8 w-8 ${selectedImage.align === 'left' ? 'bg-gray-100 text-gray-900 rounded-md' : 'rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                title="Image Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().updateAttributes('image', { align: 'center' }).run()}
                className={`p-1 h-8 w-8 ${selectedImage.align === 'center' ? 'bg-gray-100 text-gray-900 rounded-md' : 'rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                title="Image Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().updateAttributes('image', { align: 'right' }).run()}
                className={`p-1 h-8 w-8 ${selectedImage.align === 'right' ? 'bg-gray-100 text-gray-900 rounded-md' : 'rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                title="Image Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center border-l border-gray-100 pl-2 gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor && moveSelectedImage(editor, 'up')}
                className="p-1 h-8 w-8 rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                title="Move Image Up"
              >
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor && moveSelectedImage(editor, 'down')}
                className="p-1 h-8 w-8 rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                title="Move Image Down"
              >
                <MoveDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center border-l border-gray-100 pl-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor && focusTextBesideSelectedImage(editor)}
                className="p-1 h-8 px-2 rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                title="Place cursor beside image for wrapped text"
              >
                <span className="text-xs font-medium">Type beside</span>
              </Button>
            </div>

            <div className="flex items-center border-l border-gray-100 pl-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!editor) {
                    return;
                  }

                  const attrs = editor.getAttributes('image') as { alt?: string };
                  const altText = window.prompt('Edit image alt text', attrs.alt || '');
                  if (altText === null) {
                    return;
                  }

                  editor.chain().focus().updateAttributes('image', {
                    alt: altText.trim(),
                  }).run();
                }}
                className="p-1 h-8 px-2 rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                title="Edit Alt Text"
              >
                <span className="text-xs font-medium">Alt</span>
              </Button>
            </div>

            <div className="flex items-center border-l border-gray-100 pl-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().deleteSelection().run()}
                className="p-1 h-8 w-8 text-red-600 hover:bg-red-50"
                title="Remove Image"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {imageUploadError && (
          <div className="border-b border-red-200 bg-red-50 text-red-700 px-3 py-2 text-xs">
            {imageUploadError}
          </div>
        )}
      </div>

      <div className="relative group/editor">
        {/* Helper text for images */}
        {hasImageNode && !selectedImage && (
          <div className="mb-3 flex items-center gap-2 px-4 py-2 bg-[#f8f9fc] border border-[#1a237e]/10 rounded-xl text-[11px] text-[#1a237e]/70 animate-in fade-in slide-in-from-top-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#3949ab] animate-pulse"></span>
            Pro tip: Click any image to adjust alignment, size, or move it within your story.
          </div>
        )}

        <div
          className="relative min-h-[500px] w-full bg-white rounded-2xl border-2 border-gray-200 shadow-sm transition-all duration-300 focus-within:border-[#1a237e]/30 focus-within:shadow-lg overflow-hidden"
          onClick={(e) => {
            if (editor && e.target === e.currentTarget) {
              editor.chain().focus('end').run();
            }
          }}
        >
          {isUploadingImage && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] transition-all duration-300">
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-xl border border-gray-100 scale-110">
                <LoaderCircle className="h-5 w-5 animate-spin text-[#1a237e]" />
                <span className="text-sm font-semibold text-gray-700 tracking-tight">Optimizing & Uploading...</span>
              </div>
            </div>
          )}

          <div className="p-6 md:p-10 lg:p-12 pb-[20vh] cursor-text">
            <EditorContent
              editor={editor}
              className="focus:outline-none"
            />
          </div>

          {/* Editor Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white/90 backdrop-blur-sm flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                Live Editor
              </div>
            <div className="hidden sm:block">Rich Text Enabled</div>
            </div>
            <div className="flex items-center gap-3">
              <span>{characterCount} Characters</span>
              <span className="w-px h-3 bg-gray-200"></span>
              <span>{characterCount ? Math.ceil(characterCount / 5) : 0} Words</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
