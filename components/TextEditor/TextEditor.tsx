'use client'
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Load CKEditor only on the client to avoid "window is not defined" during SSR
const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((m) => m.CKEditor),
  { ssr: false }
);

interface WpCKEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  label: string;
  required?: boolean;
}

const TextEditor: React.FC<WpCKEditorProps> = ({
  initialContent = "",
  onContentChange,
  label,
  required,
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef<any>(null);

  // Dynamically import ClassicEditor only on the client
  useEffect(() => {
    let mounted = true;
    import("@ckeditor/ckeditor5-build-classic")
      .then((mod) => {
        if (mounted) {
          editorRef.current = mod.default;
          setEditorLoaded(true);
        }
      })
      .catch(() => {
        // no-op: keep editor null to avoid crashing render on server
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (_event: unknown, editorInstance: { getData: () => string }) => {
    const data = editorInstance.getData();
    setContent(data);
    onContentChange?.(data);
  };

  return (
    <>
      {label && (
        <label
          style={{ fontSize: "12px" }}
          className={`fw-medium ms-1 ${required ? "required" : ""}`}
        >
          {label}
        </label>
      )}

      <div className="wp-ckeditor-container">
        {editorLoaded && editorRef.current ? (
          <CKEditor editor={editorRef.current} data={content} onChange={handleChange} />
        ) : (
          <div className="p-4 text-sm text-gray-500">Loading editor…</div>
        )}
      </div>
    </>
  );
};

export default TextEditor;
