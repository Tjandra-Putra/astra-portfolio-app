// Use dynamic import for the Editor component
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, convertFromRaw } from "draft-js";
import draftToMarkdown from "draftjs-to-markdown";
import { markdownToDraft } from "markdown-draft-js";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
      const rawData = markdownToDraft(initialContent);
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
        <DynamicEditor
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
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
        />
      ) : (
        // Return a placeholder or an alternative component for server-side rendering
        <div>Server-side rendering not supported</div>
      )}
    </div>
  );
};
