"use client";

import { PartialBlock, BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/react/style.css";
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { uploadFiles } from "@/lib/uploadthing";

// Helper function to check if the string is valid JSON
const isValidJSON = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

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

  const handleUpload = async (file: File) => {
    const [res] = await uploadFiles("imageUploader", { files: [file] });
    return res.url;
  };

  // Conditionally parse the initial content if it's a string
  const initialEditorContent = useMemo(() => {
    if (typeof initialContent === "string" && isValidJSON(initialContent)) {
      return JSON.parse(initialContent);
    }
    return initialContent;
  }, [initialContent]);

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialEditorContent,
    uploadFile: handleUpload,
  });

  useEffect(() => {
    if (initialContent && typeof initialContent === "string" && isValidJSON(initialContent)) {
      try {
        editor.replaceBlocks(editor.document, JSON.parse(initialContent) as PartialBlock[]);
      } catch (error) {
        console.error("Error parsing initial content JSON:", error);
      }
    }
  }, [initialContent, editor]);

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
      <BlockNoteView editor={editor} onChange={onEditorChange} theme={clientTheme} editable={editable} data-theming-css-demo className={className} />
    </>
  );
};
