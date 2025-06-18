"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from '@tiptap/extension-text-align';
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  CodeIcon,
  UndoIcon,
  RedoIcon,
  RemoveFormattingIcon,
  ImageIcon,
  Table as TableIcon,
  Trash2,
  Plus,
  Minus,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
} from 'lucide-react';
import { useCallback, useRef, ChangeEvent } from "react";
import { useToast } from '@/components/ui/Toast';

const TiptapToolbar = ({ editor, triggerFileInput }: { editor: Editor | null, triggerFileInput: () => void }) => {
  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const buttonClasses =
    "p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700";
  const activeClasses = "bg-gray-200 dark:bg-gray-700";

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-t-lg p-2 flex items-center flex-wrap gap-1">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${buttonClasses} ${
          editor.isActive("bold") ? activeClasses : ""
        }`}
        title="Bold"
      >
        <BoldIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${buttonClasses} ${
          editor.isActive("italic") ? activeClasses : ""
        }`}
        title="Italic"
      >
        <ItalicIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`${buttonClasses} ${
          editor.isActive("strike") ? activeClasses : ""
        }`}
        title="Strikethrough"
      >
        <StrikethroughIcon className="w-5 h-5" />
      </button>
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={`${buttonClasses} ${
          editor.isActive("heading", { level: 2 }) ? activeClasses : ""
        }`}
        title="Heading 2"
      >
        <Heading2Icon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={`${buttonClasses} ${
          editor.isActive("heading", { level: 3 }) ? activeClasses : ""
        }`}
        title="Heading 3"
      >
        <Heading3Icon className="w-5 h-5" />
      </button>
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`${buttonClasses} ${editor.isActive({ textAlign: 'left' }) ? activeClasses : ''}`}
        title="Align Left"
      >
        <AlignLeftIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`${buttonClasses} ${editor.isActive({ textAlign: 'center' }) ? activeClasses : ''}`}
        title="Align Center"
      >
        <AlignCenterIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`${buttonClasses} ${editor.isActive({ textAlign: 'right' }) ? activeClasses : ''}`}
        title="Align Right"
      >
        <AlignRightIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`${buttonClasses} ${editor.isActive({ textAlign: 'justify' }) ? activeClasses : ''}`}
        title="Align Justify"
      >
        <AlignJustifyIcon className="w-5 h-5" />
      </button>
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`${buttonClasses} ${
          editor.isActive("bulletList") ? activeClasses : ""
        }`}
        title="Bullet List"
      >
        <ListIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`${buttonClasses} ${
          editor.isActive("orderedList") ? activeClasses : ""
        }`}
        title="Ordered List"
      >
        <ListOrderedIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={`${buttonClasses} ${
          editor.isActive("blockquote") ? activeClasses : ""
        }`}
        title="Blockquote"
      >
        <QuoteIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleCodeBlock().run();
        }}
        className={`${buttonClasses} ${
          editor.isActive("codeBlock") ? activeClasses : ""
        }`}
        title="Code Block"
      >
        <CodeIcon className="w-5 h-5" />
      </button>
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().undo().run();
        }}
        disabled={!editor.can().chain().focus().undo().run()}
        className={buttonClasses}
        title="Undo"
      >
        <UndoIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
        disabled={!editor.can().chain().focus().redo().run()}
        className={buttonClasses}
        title="Redo"
      >
        <RedoIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().unsetAllMarks().run();
        }}
        className={buttonClasses}
        title="Clear Formatting"
      >
        <RemoveFormattingIcon className="w-5 h-5" />
      </button>
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
      <button type="button" onClick={triggerFileInput} className={buttonClasses} title="Add Image">
        <ImageIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          addTable();
        }}
        className={buttonClasses}
        title="Add Table"
      >
        <TableIcon className="w-5 h-5" />
      </button>
      {editor.isActive("table") && (
        <>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className={buttonClasses}
            title="Add Column Before"
          >
            <div className="flex items-center">
              <TableIcon className="w-4 h-4" />
              <Plus className="w-3 h-3 -ml-1" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className={buttonClasses}
            title="Add Column After"
          >
            <div className="flex items-center">
              <TableIcon className="w-4 h-4" />
              <Plus className="w-3 h-3 ml-1" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className={buttonClasses}
            title="Delete Column"
          >
            <div className="flex items-center">
              <TableIcon className="w-4 h-4" />
              <Minus className="w-3 h-3" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className={buttonClasses}
            title="Add Row Before"
          >
            <div className="flex items-center transform rotate-90">
              <TableIcon className="w-4 h-4" />
              <Plus className="w-3 h-3 -ml-1" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className={buttonClasses}
            title="Add Row After"
          >
            <div className="flex items-center transform rotate-90">
              <TableIcon className="w-4 h-4" />
              <Plus className="w-3 h-3 ml-1" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className={buttonClasses}
            title="Delete Row"
          >
            <div className="flex items-center transform rotate-90">
              <TableIcon className="w-4 h-4" />
              <Minus className="w-3 h-3" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className={buttonClasses}
            title="Delete Table"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </>
      )}
    </div>
  );
};

const TiptapEditor = ({
  content,
  onChange,
  placeholder,
}: {
  content: string;
  onChange: (richText: string) => void;
  placeholder?: string;
}) => {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const editor = useEditor({
    extensions: [
      Image.configure({
        HTMLAttributes: {
          class: 'cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'table-auto border-collapse w-full',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-2 font-bold text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-400 dark:border-gray-600 p-2',
        },
      }),
      StarterKit.configure({
        heading: {
          levels: [2, 3],
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-5',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-5',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-gray-100 dark:bg-gray-800 text-sm rounded-lg p-4",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-xl max-w-none focus:outline-none border border-gray-300 dark:border-gray-600 border-t-0 rounded-b-lg p-4 min-h-[300px]",
      },
      handleClickOn(view, pos, node, nodePos, event, direct) {
        if (node.type.name === 'image') {
          triggerFileInput();
          return true;
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !editor) {
      return;
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        if (editor.isActive('image')) {
          editor.chain().focus().updateAttributes('image', { src: result.url }).run();
          addToast('Image replaced successfully.', 'success');
        } else {
          editor.chain().focus().setImage({ src: result.url }).run();
          addToast('Image uploaded successfully.', 'success');
        }
      } else {
        throw new Error(result.error || 'Image upload failed');
      }
    } catch (error) {
      console.error(error);
      addToast(error instanceof Error ? error.message : 'An unknown error occurred.', 'error');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [editor, addToast]);

  return (
    <div className="flex flex-col">
      <style jsx global>{`
        .ProseMirror-selectednode {
          outline: 3px solid #68CEF8;
        }
      `}</style>
      <TiptapToolbar editor={editor} triggerFileInput={triggerFileInput} />
      <EditorContent editor={editor} placeholder={placeholder} />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default TiptapEditor;
