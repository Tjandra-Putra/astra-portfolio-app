"use client";

import React, { useState } from "react";
// import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState } from "draft-js";
import draftToMarkdown from "draftjs-to-markdown";
import ReactMarkDown from "react-markdown";
import { stateToHTML } from "draft-js-export-html";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false });

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface InlineStyleFnOptions {
  element: string;
  style: Record<string, string>;
}

interface InlineStyleFn {
  (styles: string[]): InlineStyleFnOptions | undefined;
}

// this is to allow for custom inline styles when rendering the HTML from the editor
let options: { inlineStyleFn?: InlineStyleFn } = {
  inlineStyleFn: (styles) => {
    let key = "color-";
    let color = styles.find((value) => value.startsWith(key));

    if (color) {
      return {
        element: "span",
        style: {
          color: color.replace(key, ""),
        },
      };
    }
  },
};

export const TextEditor: React.FC = () => {
  const [editorState, setEditorState] = useState<EditorState | undefined>(EditorState.createEmpty());
  const [markdownContent, setMarkdownContent] = useState<string | undefined>("");
  const [htmlContent, setHtmlContent] = useState<string | undefined>("");

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);

    // Convert the current content to Markdown and update the state
    const contentState = newEditorState.getCurrentContent();
    const markdownText = draftToMarkdown(convertToRaw(contentState));
    setMarkdownContent(markdownText);

    // Convert the current content to HTML and update the state
    const htmlText = stateToHTML(contentState, options as any);
    setHtmlContent(htmlText);
  };

  const uploadImageCallBack = async () => {
    return Promise.resolve({ data: { link: "TODO" } });
  };

  return (
    <div>
      <Editor
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          heading: { inDropdown: true }, // Include heading options
          image: {
            uploadEnabled: true,
            previewImage: true,
            alt: { present: false, mandatory: false },
            uploadCallback: uploadImageCallBack,
          },
        }}
      />

      <hr />

      <h3>Output Markdown:</h3>
      <ReactMarkDown>{markdownContent}</ReactMarkDown>

      <hr />

      <h3>Output HTML:</h3>
      <div dangerouslySetInnerHTML={{ __html: htmlContent || "" }} />
    </div>
  );
};
