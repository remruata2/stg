"use client";

import {
  useEditor,
  EditorContent,
  type Editor,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import { mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
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
  ReplaceIcon,
  TableIcon,
  Trash2,
  Plus,
  Minus,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  PanelLeftIcon,
  PanelRightIcon,
  RectangleHorizontalIcon,
} from "lucide-react";
import { useCallback, useRef, ChangeEvent, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Extend the default Image extension for width/height attributes
const CustomImage = TiptapImage.extend({
  name: "image",
  group: "block", // Image is a block element
  atom: true, // Treat as a single, indivisible unit
  isolating: true, // Prevent content from leaking in/out, helps with schema boundaries
  inline() {
    return false; // Not inline
  },
  addAttributes() {
    return {
      ...this.parent?.(), // src, alt, title are inherited
      width: {
        default: null,
        // Check if the image is already wrapped (e.g. during parse of existing content)
        parseHTML: (element) =>
          element.closest("div.tiptap-image-wrapper")
            ? element.getAttribute("width")
            : element.getAttribute("width"),
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      height: {
        default: null,
        parseHTML: (element) =>
          element.closest("div.tiptap-image-wrapper")
            ? element.getAttribute("height")
            : element.getAttribute("height"),
        renderHTML: (attributes) => ({ height: attributes.height }),
      },
      "data-align": {
        default: "center", // Default alignment
        parseHTML: (element) => {
          const wrapper = element.closest("div.tiptap-image-wrapper");
          return wrapper
            ? wrapper.getAttribute("data-align")
            : element.getAttribute("data-align") || "center";
        },
        renderHTML: (attributes) => ({
          "data-align": attributes["data-align"],
        }), // This attribute is for the wrapper
      },
      "data-float": {
        default: "none",
        parseHTML: (element) => {
          const wrapper = element.closest("div.tiptap-image-wrapper");
          const wrapperFloat = (wrapper as HTMLElement)?.style?.float;
          const elementFloat = (element as HTMLElement)?.style?.float;
          const floatStyle = wrapperFloat || elementFloat;
          if (floatStyle === "left" || floatStyle === "right")
            return floatStyle;
          return (
            wrapper?.getAttribute("data-float") ||
            element.getAttribute("data-float") ||
            "none"
          );
        },
        renderHTML: (attributes) => ({
          "data-float": attributes["data-float"],
        }),
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const float = HTMLAttributes["data-float"] || "none";
    const align = HTMLAttributes["data-align"] || "center";

    let wrapperStyle = "";
    const wrapperAttrs: Record<string, any> = {
      "data-float": float,
      "data-align": align,
      class: "tiptap-image-wrapper",
    };

    if (float === "left") {
      wrapperStyle = "float: left; margin-right: 1em; margin-bottom: 0.5em;";
    } else if (float === "right") {
      wrapperStyle = "float: right; margin-left: 1em; margin-bottom: 0.5em;";
    } else {
      // Only apply flex alignment if not floating
      let justifyContent = "center";
      if (align === "left") justifyContent = "flex-start";
      else if (align === "right") justifyContent = "flex-end";
      wrapperStyle = `display: flex; justify-content: ${justifyContent};`;
    }
    wrapperAttrs.style = wrapperStyle;

    return [
      "div",
      wrapperAttrs,
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          "data-align": null,
          "data-float": null,
          class: `cursor-pointer ${HTMLAttributes.class || ""}`.trim(),
          // Remove float style from img if it exists, as wrapper handles it
          style:
            (HTMLAttributes.style || "")
              .replace(/float\s*:\s*(left|right);?/i, "")
              .trim() || null,
        }),
      ],
    ];
  },
});

const TiptapToolbar = ({
  editor,
  triggerFileInput,
}: {
  editor: Editor | null;
  triggerFileInput: () => void;
}) => {
  const addTable = useCallback(() => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const buttonClasses =
    "p-2 sm:p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 touch-manipulation";
  const activeClasses = "bg-gray-200 dark:bg-gray-700";

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-t-lg p-2 sm:p-3 flex items-center flex-wrap gap-1 overflow-x-auto">
      {/* Text Formatting Group */}
      <div className="flex items-center gap-1">
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
          <BoldIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <ItalicIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <StrikethroughIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

      {/* Headings Group */}
      <div className="flex items-center gap-1">
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
          <Heading2Icon className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <Heading3Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

      {/* Text Alignment Group */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`${buttonClasses} ${
            editor.isActive({ textAlign: "left" }) ? activeClasses : ""
          }`}
          title="Align Text Left"
        >
          <AlignLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`${buttonClasses} ${
            editor.isActive({ textAlign: "center" }) ? activeClasses : ""
          }`}
          title="Align Text Center"
        >
          <AlignCenterIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`${buttonClasses} ${
            editor.isActive({ textAlign: "right" }) ? activeClasses : ""
          }`}
          title="Align Text Right"
        >
          <AlignRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`${buttonClasses} ${
            editor.isActive({ textAlign: "justify" }) ? activeClasses : ""
          }`}
          title="Justify Text"
        >
          <AlignJustifyIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

      {/* Lists and Quotes Group */}
      <div className="flex items-center gap-1">
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
          <ListIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <ListOrderedIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <QuoteIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <CodeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

      {/* Undo/Redo Group */}
      <div className="flex items-center gap-1">
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
          <UndoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <RedoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <RemoveFormattingIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

      {/* Media and Table Group */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            triggerFileInput(); // This will now insert a new image or replace if one is selected
          }}
          className={`${buttonClasses} ${
            editor.isActive("image") ? "hidden" : "" // Hide if image selected, use Replace button
          }`}
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            triggerFileInput(); // This will replace the selected image
          }}
          className={`${buttonClasses} ${
            !editor.isActive("image") ? "hidden" : "" // Show only if image selected
          }`}
          title="Replace Image"
        >
          <ReplaceIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
          <TableIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Table Tools - Show when table is active */}
      {editor.isActive("table") && (
        <>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className={buttonClasses}
              title="Add Column Before"
            >
              <div className="flex items-center">
                <TableIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <Plus className="w-2 h-2 sm:w-3 sm:h-3 -ml-1" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className={buttonClasses}
              title="Add Column After"
            >
              <div className="flex items-center">
                <TableIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <Plus className="w-2 h-2 sm:w-3 sm:h-3 ml-1" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className={buttonClasses}
              title="Delete Column"
            >
              <div className="flex items-center">
                <TableIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <Minus className="w-2 h-2 sm:w-3 sm:h-3" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className={buttonClasses}
              title="Add Row Before"
            >
              <div className="flex items-center transform rotate-90">
                <TableIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <Plus className="w-2 h-2 sm:w-3 sm:h-3 -ml-1" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className={buttonClasses}
              title="Add Row After"
            >
              <div className="flex items-center transform rotate-90">
                <TableIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <Plus className="w-2 h-2 sm:w-3 sm:h-3 ml-1" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className={buttonClasses}
              title="Delete Row"
            >
              <div className="flex items-center transform rotate-90">
                <TableIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <Minus className="w-2 h-2 sm:w-3 sm:h-3" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className={buttonClasses}
              title="Delete Table"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            </button>
          </div>
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
  const [imgWidth, setImgWidth] = useState("");
  const [imgHeight, setImgHeight] = useState("");

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const editor = useEditor({
    extensions: [
      CustomImage.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "cursor-pointer", // Add any default classes for the img tag itself
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "table-auto border-collapse w-full",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class:
            "border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-2 font-bold text-left",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-400 dark:border-gray-600 p-2",
        },
      }),
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"], // Alignment is applied to block containers
        alignments: ["left", "center", "right", "justify"], // Standard alignments for text blocks
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg sm:prose-h3:text-xl max-w-none focus:outline-none border border-gray-300 dark:border-gray-600 border-t-0 rounded-b-lg p-3 sm:p-4 min-h-[200px] sm:min-h-[300px] -webkit-text-size-adjust-none bg-white dark:bg-gray-900 overflow-x-auto",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    onSelectionUpdate({ editor }) {
      if (editor.isActive("image")) {
        const attrs = editor.getAttributes("image");
        setImgWidth(attrs.width || "");
        setImgHeight(attrs.height || "");
      }
    },
  });

  const handleImageUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || !editor) {
        return;
      }

      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          if (editor.isActive("image")) {
            // If an image is selected, update its src
            editor
              .chain()
              .focus()
              .updateAttributes("image", { src: result.url })
              .run();
            addToast("Image replaced successfully.", "success");
          } else {
            // Otherwise, insert a new image
            editor.chain().focus().setImage({ src: result.url }).run();
            // Optionally, set a default alignment for new images if desired
            // editor.chain().focus().setTextAlign('center').run();
            addToast("Image uploaded successfully.", "success");
          }
        } else {
          throw new Error(result.error || "Image upload failed");
        }
      } catch (error) {
        console.error(error);
        addToast(
          error instanceof Error ? error.message : "An unknown error occurred.",
          "error"
        );
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [editor, addToast]
  );

  // For BubbleMenu: Set alignment attribute on the image node itself
  const handleSetImageAlignment = (align: "left" | "center" | "right") => {
    if (editor && editor.isActive("image")) {
      // When setting block alignment, ensure float is off
      editor
        .chain()
        .focus()
        .updateAttributes("image", {
          "data-align": align,
          "data-float": "none",
        })
        .run();
    }
  };

  const handleSetImageFloat = (float: "left" | "right" | "none") => {
    if (editor && editor.isActive("image")) {
      const attrs: { "data-float": string; "data-align"?: string } = {
        "data-float": float,
      };
      if (float !== "none") {
        // Optionally, clear data-align or set to a default if floating, as float takes precedence
        // attrs['data-align'] = 'none'; // Or keep current, or set to left/right based on float
      } else {
        // If setting float to none, we might want to restore a default block alignment like center
        attrs["data-align"] =
          editor.getAttributes("image")["data-align"] || "center";
      }
      editor.chain().focus().updateAttributes("image", attrs).run();
    }
  };

  const handleImageResize = () => {
    if (editor && editor.isActive("image")) {
      const width = imgWidth ? parseInt(imgWidth, 10) : null;
      const height = imgHeight ? parseInt(imgHeight, 10) : null;
      editor.chain().focus().updateAttributes("image", { width, height }).run();
    }
  };

  return (
    <div className="flex flex-col">
      <style jsx global>{`
        .ProseMirror-selectednode {
          /* This will now apply to the img tag directly */
          outline: 3px solid #68cef8;
        }
        /* Table overflow handling */
        .ProseMirror table {
          table-layout: fixed;
          width: 100%;
          overflow-wrap: break-word;
        }
        .ProseMirror {
          overflow-x: auto;
        }
        /* Ensure tables don't overflow the container */
        .prose table {
          display: block;
          overflow-x: auto;
          white-space: nowrap;
          width: 100%;
        }
        @media (min-width: 640px) {
          .prose table {
            display: table;
            white-space: normal;
          }
        }
      `}</style>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, placement: "top" }}
          shouldShow={({ editor, state }) => {
            const { from, to } = state.selection;
            // Only show if an image node is selected
            let show = false;
            state.doc.nodesBetween(from, to, (node) => {
              if (node.type.name === "image") {
                show = true;
              }
            });
            return show;
          }}
        >
          <div className="p-2 sm:p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg flex flex-col sm:flex-row items-center gap-2 w-80 sm:min-w-[600px] sm:w-auto max-w-[calc(100vw-2rem)]">
            {/* Image Alignment Group */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSetImageAlignment("left")}
                className={`p-2 sm:p-2.5 rounded touch-manipulation ${
                  editor.isActive("image", { "data-align": "left" })
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
                title="Align Image Left"
              >
                <AlignLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleSetImageAlignment("center")}
                className={`p-2 sm:p-2.5 rounded touch-manipulation ${
                  editor.isActive("image", { "data-align": "center" })
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
                title="Align Image Center"
              >
                <AlignCenterIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleSetImageAlignment("right")}
                className={`p-2 sm:p-2.5 rounded touch-manipulation ${
                  editor.isActive("image", { "data-align": "right" })
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
                title="Align Image Right"
              >
                <AlignRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Float/Text Wrap Buttons */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSetImageFloat("left")}
                className={`p-2 sm:p-2.5 rounded touch-manipulation ${
                  editor.isActive("image", { "data-float": "left" })
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
                title="Wrap Text Left"
              >
                <PanelLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 transform scale-x-[-1]" />
              </button>
              <button
                type="button"
                onClick={() => handleSetImageFloat("right")}
                className={`p-2 sm:p-2.5 rounded touch-manipulation ${
                  editor.isActive("image", { "data-float": "right" })
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
                title="Wrap Text Right"
              >
                <PanelRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleSetImageFloat("none")}
                className={`p-2 sm:p-2.5 rounded touch-manipulation ${
                  editor.isActive("image", { "data-float": "none" }) ||
                  (!editor.getAttributes("image")["data-float"] &&
                    editor.isActive("image"))
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
                title="No Text Wrap (Block Display)"
              >
                <RectangleHorizontalIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />

            {/* Size Controls */}
            <div className="flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto">
              <Input
                type="number"
                value={imgWidth}
                onChange={(e) => setImgWidth(e.target.value)}
                placeholder="Width"
                className="w-20 sm:w-24 h-8 text-xs sm:text-sm"
              />
              <Input
                type="number"
                value={imgHeight}
                onChange={(e) => setImgHeight(e.target.value)}
                placeholder="Height"
                className="w-20 sm:w-24 h-8 text-xs sm:text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImageResize}
                className="touch-manipulation"
              >
                Apply
              </Button>
            </div>
          </div>
        </BubbleMenu>
      )}
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
