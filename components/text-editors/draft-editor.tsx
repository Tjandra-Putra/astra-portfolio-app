// Use dynamic import for the Editor component
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, convertFromRaw } from "draft-js";
import draftToMarkdown from "draftjs-to-markdown";
import { markdownToDraft } from "markdown-draft-js";
import ReactMarkdown from "react-markdown";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { set } from "date-fns";

interface TextEditorProps {
  onMarkdownChange: (markdown: string) => void;
  initialContent?: string;
}

// Dynamic import for the Editor component with disabled SSR
const DynamicEditor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), {
  ssr: false,
});

export const TextEditor: React.FC<TextEditorProps> = ({ onMarkdownChange, initialContent }) => {
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const [markdownContent, setMarkdownContent] = useState<string | undefined>("");

  // Set the initial content when it exists
  useEffect(() => {
    if (initialContent) {
      const rawData = markdownToDraft(initialContent, { preserveNewlines: true });
      const contentState = convertFromRaw(rawData);
      const newEditorState = EditorState.createWithContent(contentState);

      setEditorState(newEditorState);
    }
  }, [initialContent]);

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);

    // Use dynamic import for draftjs-to-markdown
    import("draftjs-to-markdown").then((mod) => {
      // Convert the current content to Markdown and update the state
      const contentState = newEditorState.getCurrentContent();
      const markdownText = mod.default(convertToRaw(contentState));
      setMarkdownContent(markdownText);
      onMarkdownChange(markdownText);
    });
  };

  const uploadImageCallBack = async () => {
    // upload to uploadthing and get back the url
    return Promise.resolve({ data: { link: "TODO" } });
  };

  // Only use the Editor component if window is defined (client side)
  return (
    <div>
      {typeof window !== "undefined" ? (
        <>
          <DynamicEditor
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor p-2 m-0 leading-normal"
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "list",
                "textAlign",
                "link",
                "embedded",
                "image",
                "remove",
                "history",
              ],
            }}
            spellCheck={true}
          />
          {/* <button> OUTPUT</button>
          <div className="markdown-content whitespace-pre-wrap bg-slate-200">{markdownContent || ""}</div>
          <button>OUTPUT</button>
          <div className="markdown-content whitespace-pre-wrap bg-slate-100">
            <ReactMarkdown
              components={{
                img: ({ node, ...props }) => {
                  return <img {...props} className="w-full h-full rounded-lg my-6 shadow-paper" />;
                },
                li: ({ node, ...props }) => {
                  return <li {...props} className="list-disc list-inside" />;
                },
                ol: ({ node, ...props }) => {
                  return <ol {...props} className="list-decimal list-inside leading-relaxed" />;
                },
                p: ({ node, ...props }) => {
                  return <p {...props} className="leading-0" />;
                },
              }}
            >
              {markdownContent || ""}
            </ReactMarkdown>
          </div> */}
        </>
      ) : (
        // Return a placeholder or an alternative component for server-side rendering
        <div>Server-side rendering not supported</div>
      )}
    </div>
  );
};
