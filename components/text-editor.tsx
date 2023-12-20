"use client";

import React, { useState } from "react";
import { Editor, EditorState } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import draftToMarkdown from "draftjs-to-markdown";
import ReactMarkDown from "react-markdown";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export const TextEditor: React.FC = () => {
  const [editorState, setEditorState] = useState<EditorState | undefined>(undefined);
  const [content, setContent] = useState<string | undefined>(
    "**Hello** # My name is Jef 😎Hello&nbsp; ![](https://blog.hubspot.com/hs-fs/hubfs/image8-2.jpg?width=600&name=image8-2.jpg)"
  );

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
      />

      <textarea disabled value={editorState && draftToMarkdown(convertToRaw(editorState.getCurrentContent()))} />

      <ReactMarkDown>{content}</ReactMarkDown>
    </div>
  );
};
