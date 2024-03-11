"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading3,
  Heading4,
  Heading5,
  Heading,
  Underline,
  Minus,
  Undo,
  Redo,
  Code,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { remark } from "remark";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";

import styles from "./styles.module.css";

interface TiptapProps {
  content?: string;
  onMarkdownChange: (content: string) => void;
}

const Tiptap = ({ content, onMarkdownChange }: TiptapProps) => {
  const [position, setPosition] = React.useState("bottom");
  const [htmlContent, setHtmlContent] = React.useState(content);
  const [markdownContent, setMarkdownContent] = React.useState(content);

  const handleChange = (newContent: string) => {
    onMarkdownChange(HtmlToMarkdown(newContent) || "");
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌎️</p>",
    editorProps: {
      attributes: {
        class: "p-4 border-none",
      },
    },

    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  // console.log(editor.getHTML());

  // saving to database as markdown from html
  const HtmlToMarkdown = (htmlContent: string): string | undefined => {
    try {
      const file = remark()
        .use(rehypeParse, { emitParseErrors: true, duplicateAttribute: false })
        .use(rehypeRemark)
        .use(remarkStringify)
        .processSync(htmlContent);

      const markdown = file.value;

      return markdown.toString(); // Convert the Uint8Array to string
    } catch (error) {
      console.error("Error converting HTML to Markdown:", error);
      return undefined;
    }
  };

  return (
    <>
      <div className="buttons flex flex-row justify-start gap-2 p-2 flex-wrap w-full border border-b-black-800">
        <Button
          type="button"
          variant={"ghost"}
          size={"sm"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={"ghost"}
          size={"sm"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={"ghost"}
          size={"sm"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={"ghost"}
          size={"sm"}
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          <Code className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size={"sm"}>
              <Heading className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Text Format</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
              <DropdownMenuRadioItem
                value="normal-text"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive("paragraph") ? "is-active" : "cursor-pointer"}
              >
                <div className="text-xs">Normal Text</div>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="heading-3"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive("heading", { level: 3 }) ? "is-active" : "cursor-pointer"}
              >
                <Heading3 className="w-4 h-4" />
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="heading-4"
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={editor.isActive("heading", { level: 4 }) ? "is-active" : "cursor-pointer"}
              >
                <Heading4 className="w-4 h-4" />
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="heading-5"
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={editor.isActive("heading", { level: 5 }) ? "is-active" : "cursor-pointer"}
              >
                <Heading5 className="w-4 h-4" />
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          type="button"
          variant={"ghost"}
          size={"sm"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={"ghost"}
          size={"sm"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={"ghost"}
          size={"sm"}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={"ghost"}
          size={"sm"}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={"ghost"}
          size={"sm"}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      <div className={styles.editor}>
        <EditorContent editor={editor} className="p-2 whitespace-pre-line" />
      </div>
    </>
  );
};

export default Tiptap;
