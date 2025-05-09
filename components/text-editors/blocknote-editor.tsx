"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { uploadFiles } from "@/lib/uploadthing";

interface EditorProps {
  onParentEditorChange?: (value: string) => void;
  initialContent?: PartialBlock[] | string;
  editable?: boolean;
  className?: string;
}

export const Editor = ({ onParentEditorChange, initialContent, editable = true, className }: EditorProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [clientTheme, setClientTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "system") {
      setClientTheme(resolvedTheme === "dark" ? "dark" : "light");
    } else {
      setClientTheme(theme === "dark" ? "dark" : "light");
    }
  }, [theme, resolvedTheme]);

  // Helper to safely parse JSON
  const isValidJSON = (content: string): boolean => {
    try {
      JSON.parse(content);
      return true;
    } catch {
      return false;
    }
  };

  // Prepare initial content as a string for keying and parsing
  const initialContentString = useMemo(() => {
    if (!initialContent) return "";
    return typeof initialContent === "string" ? initialContent : JSON.stringify(initialContent);
  }, [initialContent]);

  // Key for remounting editor when content changes
  const editorKey = initialContentString;

  // Create the editor only when initial content changes
  const editor = useCreateBlockNote({
    initialContent: initialContentString && isValidJSON(initialContentString) ? JSON.parse(initialContentString) : [],
    uploadFile: async (file: File) => {
      const [res] = await uploadFiles("imageUploader", { files: [file] });
      return res.url;
    },
  });

  // Handle editor changes
  const onEditorChange = () => {
    if (onParentEditorChange) {
      onParentEditorChange(JSON.stringify(editor.document));
    }
  };

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
        key={editorKey}
        editor={editor}
        onChange={onEditorChange}
        theme={clientTheme}
        editable={editable}
        data-theming-css-demo
        className={className}
      />
    </>
  );
};
