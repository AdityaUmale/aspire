'use client';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { mergeAttributes } from '@tiptap/core';
import {
  useEditor,
  EditorContent,
  Editor,
  useEditorState,
  BubbleMenu,
  FloatingMenu,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImagePlus,
  Link2,
  LoaderCircle,
  Trash2,
  MoveUp,
  MoveDown,
  Expand,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Unlink,
  Plus,
} from 'lucide-react';
import EditorPromptDialog from '@/components/EditorPromptDialog';
import {
  MAX_UPLOAD_IMAGE_MB,
  resizeImageFileIfNeeded,
} from '@/lib/client-image-resize';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  stickyToolbar?: boolean;
  toolbarOffsetPx?: number;
  /**
   * When false (default), body image insert/paste/drop is disabled.
   * Use a separate cover image field instead (PR 5).
   * Extension still loads so legacy HTML with images can display if present.
   */
  allowInlineImages?: boolean;
  borderless?: boolean;
  className?: string;
}

export type RichTextEditorHandle = {
  /** Latest HTML from the editor (not debounced parent state). */
  getHTML: () => string;
  /** Immediately sync parent state + return HTML. Call before submit/autosave. */
  flush: () => string;
};

type ImageAlign = 'left' | 'center' | 'right';

const ON_CHANGE_DEBOUNCE_MS = 400;

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

const normalizeImageWidth = (value?: string | number | null): string =>
  `${parseWidthPercentage(value)}%`;

const normalizeImageAlign = (value?: string | null): ImageAlign => {
  if (value === 'left' || value === 'right' || value === 'center') {
    return value;
  }
  return 'center';
};

const buildImageStyle = (width: string, align: ImageAlign): string => {
  const styleParts = [`width: ${width}`, 'max-width: 100%', 'height: auto'];

  if (align === 'left') {
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
        parseHTML: (element) =>
          normalizeImageWidth(
            element.getAttribute('width') || element.style.width || '100%'
          ),
      },
      align: {
        default: 'center',
        parseHTML: (element) => {
          const dataAlign = element.getAttribute('data-align');
          if (
            dataAlign === 'left' ||
            dataAlign === 'right' ||
            dataAlign === 'center'
          ) {
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
        loading: 'lazy',
        decoding: 'async',
      }),
    ];
  },
});

const uploadImageFile = async (file: File): Promise<string> => {
  if (file.size > MAX_UPLOAD_IMAGE_MB * 1024 * 1024 * 2) {
    // Hard stop on absurdly large files before canvas work
    throw new Error(`Image is too large. Max size is ${MAX_UPLOAD_IMAGE_MB}MB.`);
  }

  const optimized = await resizeImageFileIfNeeded(file);

  if (optimized.size > MAX_UPLOAD_IMAGE_MB * 1024 * 1024) {
    throw new Error(
      `Image is still over ${MAX_UPLOAD_IMAGE_MB}MB after compression. Try a smaller file.`
    );
  }

  const formData = new FormData();
  formData.append('file', optimized);

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

type PromptState =
  | null
  | {
      kind: 'link' | 'image-url' | 'image-alt' | 'image-alt-edit';
      initialValue?: string;
    };

const moveSelectedImage = (editor: Editor, direction: 'up' | 'down') => {
  const { state, view } = editor;
  const selection = state.selection;

  if (
    !(selection instanceof NodeSelection) ||
    selection.node.type.name !== 'image'
  ) {
    return;
  }

  const topLevelNodes: Array<{ pos: number; node: NodeSelection['node'] }> = [];
  state.doc.forEach((node, offset) => {
    topLevelNodes.push({ pos: offset, node });
  });

  const currentIndex = topLevelNodes.findIndex(
    (entry) => entry.pos === selection.from
  );
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

  if (
    !(selection instanceof NodeSelection) ||
    selection.node.type.name !== 'image'
  ) {
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

  tr = tr.setSelection(
    TextSelection.near(tr.doc.resolve(imageEndPosition + 1), 1)
  );
  view.dispatch(tr.scrollIntoView());
  view.focus();
};

const toolbarBtn = (active?: boolean) =>
  `p-1 h-8 w-8 ${
    active
      ? 'bg-[#1a237e]/10 text-[#1a237e] rounded-md'
      : 'rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`;

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor(
    {
      content,
      onChange,
      placeholder = 'Start writing...',
      stickyToolbar = true,
      toolbarOffsetPx = 96,
      allowInlineImages = false,
      borderless = false,
      className,
    },
    ref
  ) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const editorRef = useRef<Editor | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [promptState, setPromptState] = useState<PromptState>(null);
  const pendingImageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const emitChange = useCallback((html: string, immediate = false) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (immediate) {
      onChangeRef.current(html);
      return;
    }

    debounceRef.current = setTimeout(() => {
      onChangeRef.current(html);
    }, ON_CHANGE_DEBOUNCE_MS);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      getHTML: () => editorRef.current?.getHTML() ?? '',
      flush: () => {
        const html = editorRef.current?.getHTML() ?? '';
        emitChange(html, true);
        return html;
      },
    }),
    [emitChange]
  );

  useEffect(() => {
    return () => {
      // Flush pending debounced HTML so unmount doesn't drop last keystrokes.
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
        const html = editorRef.current?.getHTML();
        if (html != null) {
          onChangeRef.current(html);
        }
      }
    };
  }, []);

  const uploadAndInsertFiles = useCallback(
    async (files: File[], view: EditorView, startPosition?: number) => {
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

          const position =
            typeof insertPos === 'number' ? insertPos : state.selection.from;
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
        const message =
          error instanceof Error ? error.message : 'Unable to upload image';
        setImageUploadError(message);
      } finally {
        setIsUploadingImage(false);
      }
    },
    []
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
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
      // Keep image node for legacy HTML; insertion gated by allowInlineImages.
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
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'listItem'],
      }),
      CharacterCount,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'rich-text-editor prose max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-[18px] prose-p:text-gray-700 prose-p:leading-[1.8] prose-a:text-[#1a237e] hover:prose-a:text-[#0d1642] prose-strong:text-gray-800 focus:outline-none min-h-[150px] cursor-text',
        style: 'outline: none;',
      },
      handlePaste: (view, event) => {
        if (!allowInlineImages) {
          return false;
        }
        const files = Array.from(event.clipboardData?.files ?? []).filter(
          (file) => file.type.startsWith('image/')
        );
        if (files.length === 0) {
          return false;
        }

        event.preventDefault();
        void uploadAndInsertFiles(files, view);
        return true;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!allowInlineImages || moved) {
          return false;
        }

        const files = Array.from(event.dataTransfer?.files ?? []).filter(
          (file) => file.type.startsWith('image/')
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
    onUpdate: ({ editor: currentEditor }) => {
      emitChange(currentEditor.getHTML());
    },
  });

  editorRef.current = editor;

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return {
          characters: 0,
          words: 0,
          isBold: false,
          isItalic: false,
          isH2: false,
          isH3: false,
          isBulletList: false,
          isOrderedList: false,
          isBlockquote: false,
          isLink: false,
          canUndo: false,
          canRedo: false,
          selectedImage: null as null | { width: number; align: ImageAlign },
          hasImageNode: false,
        };
      }

      const { editor: current } = ctx;
      let hasImageNode = false;
      current.state.doc.descendants((node) => {
        if (node.type.name === 'image') {
          hasImageNode = true;
          return false;
        }
        return !hasImageNode;
      });

      const imageActive = current.isActive('image');
      const imageAttrs = imageActive
        ? (current.getAttributes('image') as {
            width?: string;
            align?: string;
          })
        : null;

      return {
        characters: current.storage.characterCount?.characters?.() ?? 0,
        words: current.storage.characterCount?.words?.() ?? 0,
        isBold: current.isActive('bold'),
        isItalic: current.isActive('italic'),
        isH2: current.isActive('heading', { level: 2 }),
        isH3: current.isActive('heading', { level: 3 }),
        isBulletList: current.isActive('bulletList'),
        isOrderedList: current.isActive('orderedList'),
        isBlockquote: current.isActive('blockquote'),
        isLink: current.isActive('link'),
        canUndo: current.can().undo(),
        canRedo: current.can().redo(),
        selectedImage: imageAttrs
          ? {
              width: parseWidthPercentage(imageAttrs.width),
              align: normalizeImageAlign(imageAttrs.align),
            }
          : null,
        hasImageNode,
      };
    },
  });

  // Sync external content reset (e.g. after form submission) into the editor
  useEffect(() => {
    if (editor && content === '' && editor.getHTML() !== '<p></p>') {
      editor.commands.clearContent();
    }
  }, [content, editor]);

  // Restore external draft content once on mount / when content arrives from outside
  useEffect(() => {
    if (!editor || !content) {
      return;
    }

    const current = editor.getHTML();
    if (content !== current && (current === '<p></p>' || current === '')) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const setLink = () => {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes('link').href as string | undefined;
    setPromptState({
      kind: 'link',
      initialValue: previousUrl || 'https://',
    });
  };

  const insertImageFromUrl = () => {
    if (!editor) {
      return;
    }
    setPromptState({ kind: 'image-url', initialValue: 'https://' });
  };

  const handlePromptConfirm = (value: string) => {
    if (!editor || !promptState) {
      return;
    }

    if (promptState.kind === 'link') {
      if (value === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        setPromptState(null);
        return;
      }

      const isRelativeUrl = value.startsWith('/');
      const isAbsoluteHttpUrl = /^https?:\/\//i.test(value);
      if (!isRelativeUrl && !isAbsoluteHttpUrl) {
        setImageUploadError('Links must start with http(s):// or /.');
        setPromptState(null);
        return;
      }

      setImageUploadError(null);
      editor.chain().focus().extendMarkRange('link').setLink({ href: value }).run();
      setPromptState(null);
      return;
    }

    if (promptState.kind === 'image-url') {
      const isRelativeUrl = value.startsWith('/');
      const isAbsoluteHttpUrl = /^https?:\/\//i.test(value);
      if (!isRelativeUrl && !isAbsoluteHttpUrl) {
        setImageUploadError('Use a valid URL starting with http(s):// or /.');
        setPromptState(null);
        return;
      }

      pendingImageUrlRef.current = value;
      setPromptState({ kind: 'image-alt', initialValue: '' });
      return;
    }

    if (promptState.kind === 'image-alt') {
      const src = pendingImageUrlRef.current;
      pendingImageUrlRef.current = null;
      setPromptState(null);
      if (!src) {
        return;
      }

      setImageUploadError(null);
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: {
            src,
            alt: value,
            width: '100%',
            align: 'center',
          },
        })
        .run();
      return;
    }

    if (promptState.kind === 'image-alt-edit') {
      editor.chain().focus().updateAttributes('image', { alt: value }).run();
      setPromptState(null);
    }
  };

  const handleImageFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!editor) {
      return;
    }

    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith('image/')
    );
    if (files.length === 0) {
      return;
    }

    await uploadAndInsertFiles(files, editor.view);
    event.target.value = '';
  };

  const selectedImage = editorState?.selectedImage ?? null;
  const hasImageNode = editorState?.hasImageNode ?? false;
  const characters = editorState?.characters ?? 0;
  const words = editorState?.words ?? 0;

  return (
    <div className={cn("w-full relative group", className)}>
      <EditorPromptDialog
        open={promptState?.kind === 'link'}
        title="Add link"
        description="Leave empty to remove an existing link."
        label="URL"
        placeholder="https://example.com"
        initialValue={promptState?.kind === 'link' ? promptState.initialValue : ''}
        allowEmpty
        confirmLabel="Save link"
        onCancel={() => setPromptState(null)}
        onConfirm={handlePromptConfirm}
      />
      <EditorPromptDialog
        open={promptState?.kind === 'image-url'}
        title="Insert image from URL"
        label="Image URL"
        placeholder="https://… or /path"
        initialValue={
          promptState?.kind === 'image-url' ? promptState.initialValue : ''
        }
        confirmLabel="Continue"
        onCancel={() => setPromptState(null)}
        onConfirm={handlePromptConfirm}
      />
      <EditorPromptDialog
        open={promptState?.kind === 'image-alt'}
        title="Image alt text"
        description="Optional — helps accessibility and SEO."
        label="Alt text"
        placeholder="Describe the image"
        initialValue=""
        allowEmpty
        confirmLabel="Insert image"
        onCancel={() => {
          pendingImageUrlRef.current = null;
          setPromptState(null);
        }}
        onConfirm={handlePromptConfirm}
      />
      <EditorPromptDialog
        open={promptState?.kind === 'image-alt-edit'}
        title="Edit image alt text"
        label="Alt text"
        initialValue={
          promptState?.kind === 'image-alt-edit'
            ? promptState.initialValue || ''
            : ''
        }
        allowEmpty
        confirmLabel="Save"
        onCancel={() => setPromptState(null)}
        onConfirm={handlePromptConfirm}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleImageFileSelect}
      />

      {editor ? (
        <>
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 120 }}
            shouldShow={({ editor: current, state }) => {
              const { selection } = state;
              if (selection.empty || current.isActive('image')) {
                return false;
              }
              return selection.from !== selection.to;
            }}
            className="flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={toolbarBtn(editorState?.isBold)}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={toolbarBtn(editorState?.isItalic)}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={toolbarBtn(editorState?.isLink)}
              onClick={setLink}
            >
              <Link2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={toolbarBtn(editorState?.isH2)}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={toolbarBtn(editorState?.isBlockquote)}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="h-3.5 w-3.5" />
            </Button>
          </BubbleMenu>

          <FloatingMenu
            editor={editor}
            tippyOptions={{ duration: 120 }}
            className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
              <Plus className="h-3.5 w-3.5" />
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              H2
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              Quote
            </Button>
            {allowInlineImages ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                Image
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              Divider
            </Button>
          </FloatingMenu>
        </>
      ) : null}

      <div
        className={cn(
          'transition-all duration-300 relative z-10',
          borderless
            ? 'p-2 bg-gray-50/80 border-b border-gray-200 w-full'
            : 'p-1.5 md:p-2 bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.08)] mx-auto mb-6 w-max max-w-full',
          stickyToolbar && 'sticky z-40'
        )}
        style={stickyToolbar ? { top: `${toolbarOffsetPx}px` } : undefined}
      >
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto px-1">
          <div className="flex items-center mr-2 border-r pr-2 border-gray-200">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!editorState?.canUndo}
              onClick={() => editor?.chain().focus().undo().run()}
              className={toolbarBtn()}
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!editorState?.canRedo}
              onClick={() => editor?.chain().focus().redo().run()}
              className={toolbarBtn()}
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center mr-2 border-r pr-2 border-gray-200">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={toolbarBtn(editorState?.isH2)}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={toolbarBtn(editorState?.isH3)}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center mr-2 border-r pr-2 border-gray-200">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={toolbarBtn(editorState?.isBold)}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={toolbarBtn(editorState?.isItalic)}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={setLink}
              className={toolbarBtn(editorState?.isLink)}
              title="Add link"
            >
              <Link2 className="h-4 w-4" />
            </Button>
            {editorState?.isLink ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor?.chain().focus().extendMarkRange('link').unsetLink().run()
                }
                className={toolbarBtn()}
                title="Remove link"
              >
                <Unlink className="h-4 w-4" />
              </Button>
            ) : null}
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
              className={toolbarBtn(editorState?.isBulletList)}
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
              className={toolbarBtn(editorState?.isOrderedList)}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={toolbarBtn(editorState?.isBlockquote)}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              className={toolbarBtn()}
              title="Divider"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center mr-2 border-r pr-2 border-gray-200">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              className={toolbarBtn()}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor?.chain().focus().setTextAlign('center').run()
              }
              className={toolbarBtn()}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor?.chain().focus().setTextAlign('right').run()
              }
              className={toolbarBtn()}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor?.chain().focus().setTextAlign('justify').run()
              }
              className={toolbarBtn()}
              title="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          {allowInlineImages ? (
            <div className="flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="p-1 h-8 px-2.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-1.5"
                title="Upload Image (max 4.5MB)"
              >
                <ImagePlus className="h-4 w-4" />
                <span className="text-xs font-medium">Image</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertImageFromUrl}
                className="p-1 h-8 px-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                title="Insert Image URL"
              >
                <span className="text-xs font-medium">URL</span>
              </Button>
            </div>
          ) : null}
        </div>

        {allowInlineImages && selectedImage && (
          <div className="flex flex-wrap items-center gap-2 border border-[#1a237e]/15 rounded-md p-2 bg-white mt-2">
            <div className="flex items-center gap-2 mr-2">
              <Expand className="h-3.5 w-3.5 text-[#1a237e]" />
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={selectedImage.width}
                onChange={(event) =>
                  editor
                    ?.chain()
                    .focus()
                    .updateAttributes('image', {
                      width: `${event.target.value}%`,
                    })
                    .run()
                }
                className="w-28 accent-[#1a237e]"
                title="Resize image"
              />
              <span className="text-xs text-[#1a237e] min-w-[42px]">
                {selectedImage.width}%
              </span>
            </div>

            <div className="flex items-center border-l border-gray-100 pl-2 gap-1">
              {(['left', 'center', 'right'] as const).map((align) => (
                <Button
                  key={align}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    editor
                      ?.chain()
                      .focus()
                      .updateAttributes('image', { align })
                      .run()
                  }
                  className={`p-1 h-8 w-8 ${
                    selectedImage.align === align
                      ? 'bg-gray-100 text-gray-900 rounded-md'
                      : 'rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={`Image ${align}`}
                >
                  {align === 'left' ? (
                    <AlignLeft className="h-4 w-4" />
                  ) : align === 'center' ? (
                    <AlignCenter className="h-4 w-4" />
                  ) : (
                    <AlignRight className="h-4 w-4" />
                  )}
                </Button>
              ))}
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

                  const attrs = editor.getAttributes('image') as {
                    alt?: string;
                  };
                  setPromptState({
                    kind: 'image-alt-edit',
                    initialValue: attrs.alt || '',
                  });
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
          <div className="border-b border-red-200 bg-red-50 text-red-700 px-3 py-2 text-xs mt-2 rounded-md">
            {imageUploadError}
          </div>
        )}
      </div>

      <div className="relative group/editor">
        {allowInlineImages && hasImageNode && !selectedImage && (
          <div className="mb-3 flex items-center gap-2 px-4 py-2 bg-[#f8f9fc] border border-[#1a237e]/10 rounded-xl text-[11px] text-[#1a237e]/70">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#3949ab] animate-pulse" />
            Pro tip: Click any image to adjust alignment, size, or move it within
            your story.
          </div>
        )}

        <div
          className={cn(
            "relative w-full transition-all duration-300 overflow-hidden",
            borderless
              ? "bg-transparent border-0 shadow-none focus-within:border-0 focus-within:shadow-none min-h-[400px]"
              : "bg-white rounded-2xl border-2 border-gray-200 shadow-sm focus-within:border-[#1a237e]/30 focus-within:shadow-lg min-h-[500px]"
          )}
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
                <span className="text-sm font-semibold text-gray-700 tracking-tight">
                  Uploading image…
                </span>
              </div>
            </div>
          )}

          <div className={cn("pb-[5vh] cursor-text", borderless ? "p-4 md:p-6" : "p-6 md:p-10 lg:p-12")}>
            <EditorContent editor={editor} className="focus:outline-none" />
          </div>

          {!borderless && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white/90 backdrop-blur-sm flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 transition-all">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  Live Editor
                </div>
                <div className="hidden sm:block">
                  {allowInlineImages
                    ? `Images auto-optimized · max ${MAX_UPLOAD_IMAGE_MB}MB`
                    : 'Use the cover image field for your thumbnail'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span>{characters} Characters</span>
                <span className="w-px h-3 bg-gray-200" />
                <span>{words} Words</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default RichTextEditor;
