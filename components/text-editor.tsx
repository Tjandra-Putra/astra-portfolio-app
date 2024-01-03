"use client";

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

    // Convert the current content to Markdown and update the state
    const contentState = newEditorState.getCurrentContent();
    const markdownText = draftToMarkdown(convertToRaw(contentState));
    setMarkdownContent(markdownText);

    onMarkdownChange(markdownText);
  };

  const uploadImageCallBack = async () => {
    // upload to uploadthing and get back the url
    return Promise.resolve({ data: { link: "TODO" } });
  };

  // Only use the Editor component if window is defined (client side)
  return (
    <div>
      <Editor
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            // "fontFamily",
            "list",
            "textAlign",
            // "colorPicker",
            "link",
            "embedded",
            // "emoji",
            "image",
            "remove",
            "history",
          ],
          // ... (rest of the toolbar configuration remains unchanged)
        }}
      />
    </div>
  );

  // return (
  //   <div>
  //     <Editor
  //       wrapperClassName="text-editor-wrapper"
  //       editorClassName="text-editor"
  //       editorState={editorState}
  //       onEditorStateChange={onEditorStateChange}
  //       toolbar={{
  //         options: [
  //           "inline",
  //           "blockType",
  //           "fontSize",
  //           // "fontFamily",
  //           "list",
  //           "textAlign",
  //           // "colorPicker",
  //           "link",
  //           "embedded",
  //           // "emoji",
  //           "image",
  //           "remove",
  //           "history",
  //         ],
  //         inline: { inDropdown: true },
  //         blockType: {
  //           inDropdown: true,
  //           options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6", "Blockquote", "Code"],
  //           className: undefined,
  //           component: undefined,
  //           dropdownClassName: undefined,
  //         },
  //         list: { inDropdown: true },
  //         textAlign: { inDropdown: true },
  //         link: { inDropdown: true },
  //         // history: { inDropdown: true },
  //         heading: { inDropdown: true },
  //         image: {
  //           uploadEnabled: true,
  //           previewImage: true,
  //           alt: { present: false, mandatory: false },
  //           uploadCallback: uploadImageCallBack,
  //         },
  //       }}
  //     />
  //   </div>
  // );
};
