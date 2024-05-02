"use client";

import { BlockNoteEditor, Block, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import "./styles.css";
import { useEffect, useState } from "react";
import classNames from "classnames";

interface EditorProps {
  onParentEditorChange?: (value: string) => void;
  initialContent?: PartialBlock[] | string;
  editable?: boolean;
  className?: string; // Add className prop
}

export const Editor = ({ onParentEditorChange, initialContent, editable = true, className }: EditorProps) => {
  const isValidJSON = (content: string): boolean => {
    try {
      JSON.parse(content);
      return true;
    } catch (error) {
      console.error("Error parsing initial content JSON:", error);
      return false;
    }
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent:
      typeof initialContent === "string" && isValidJSON(initialContent) ? JSON.parse(initialContent) : initialContent,
  });

  const onEditorChange = () => {
    if (onParentEditorChange) {
      onParentEditorChange(JSON.stringify(editor.document));
    }
  };

  useEffect(() => {
    if (initialContent) {
      try {
        editor.replaceBlocks(editor.document, JSON.parse(initialContent as string) as PartialBlock[]);
      } catch (error) {
        console.error("Error parsing initial content JSON:", error);
      }
    }
  }, [editor, initialContent]);

  return (
    <>
      {!editable && (
        <style>
          {`
            .bn-container[data-theming-css-demo] .bn-editor {
              padding-inline: 0px;
            }
          `}
        </style>
      )}
      <BlockNoteView
        editor={editor}
        onChange={() => onEditorChange()}
        theme="light"
        editable={editable}
        data-theming-css-demo
      />
    </>
  );
};
