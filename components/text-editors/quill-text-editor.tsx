"use effect";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import markdownit from "markdown-it";
import ReactMarkdown from "react-markdown";

import { remark } from "remark";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

interface QuillTextEditorProps {
  onMarkdownChange: (markdown: string) => void;
  initialContent?: string;
}

interface QuillModules {
  toolbar: Array<Array<string | object>>;
}

interface QuillFormats extends Array<string> {}

const quillModules: QuillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    [
      "link",
      //  "image",
      // "video",
    ],
    [{ align: [] }],
    // [{ color: [] }],
    ["code-block"],
    ["clean"],
  ],
};

// order of the components
const quillFormats: QuillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "align",
  "color",
  "code-block",
];

const QuillTextEditor: React.FC<QuillTextEditorProps> = ({ onMarkdownChange, initialContent }) => {
  const [content, setContent] = useState<string>(""); // default is of type Html Text
  const [markdownContent, setMarkdownContent] = useState<string>();

  useEffect(() => {
    if (initialContent) {
      MarkdownToHtml(initialContent);
    }
  }, [initialContent]);

  const handleEditorChange = (newContent: string) => {
    setContent(newContent); // html text
    setMarkdownContent(HtmlToMarkdown(newContent)); // convert to markdown
    onMarkdownChange(markdownContent!);

    console.log(markdownContent);
  };

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

  const MarkdownToHtml = (rawMarkdown: string) => {
    const md = markdownit();
    md.set({
      html: true,
    });

    const result = md.render(rawMarkdown);
    setContent(result);
  };

  return (
    <>
      <QuillEditor
        theme="snow"
        value={content}
        onChange={handleEditorChange}
        modules={quillModules}
        formats={quillFormats}
        className="w-full h-full white"
        style={{ border: "none !important" }}
      />

      {/* <ReactMarkdown>{markdownContent}</ReactMarkdown> */}
    </>
  );
};

export default QuillTextEditor;
