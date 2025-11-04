'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Type for CKEditor instance
interface CKEditorInstance {
  getData: () => string;
}

// Type for ClassicEditor - runtime loaded; typings vary across builds

const TextEditor: React.FC<WpCKEditorProps> = ({
  initialContent = "",
  onContentChange,
  label,
  required,
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef<any>(null);

  const editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'alignment',
        '|',
        'numberedList',
        'bulletedList',
        '|',
        'outdent',
        'indent',
        '|',
        'link',
        'blockQuote',
        'insertTable',
        '|',
        'imageUpload',
        'mediaEmbed',
        '|',
        'undo',
        'redo',
        '|',
        'code',
        'codeBlock',
        '|',
        'horizontalLine',
        'specialCharacters',
        '|',
        'findAndReplace',
        '|',
        'sourceEditing'
      ],
      shouldNotGroupWhenFull: true
    },
    fontSize: {
      options: [9, 11, 13, 'default', 17, 19, 21, 24, 27, 30, 36, 48]
    },
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    alignment: {
      options: ['left', 'center', 'right', 'justify']
    },
    link: {
      decorators: {
        openInNewTab: {
          mode: "manual" as const,
          label: 'Open in a new tab',
          attributes: {
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        }
      }
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties'
      ]
    },
    image: {
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        'linkImage'
      ]
    }
  };

  // Dynamically import ClassicEditor only on the client
  // IMPORTANT: To enable Alignment (text center) option:
  // 1. Create custom build at: https://ckeditor.com/ckeditor-5/online-builder/
  // 2. Add "Alignment" plugin
  // 3. Download and place custom build at: components/ckeditor5-custom-build/build/ckeditor
  // 4. Uncomment the custom build import below
  // See: CKEDITOR_CUSTOM_BUILD_INSTRUCTIONS.md for details
  useEffect(() => {
    let mounted = true;
    
    // Try a custom build that includes Alignment plugin first. If it doesn't exist, fall back.
    const tryLoad = async () => {
      try {
        // path relative to this file: components/TextEditor -> project root -> ckeditor5-custom-build
        // Use dynamic evaluator to avoid TypeScript module resolution errors when the folder doesn't exist.
        const dynImport = new Function('p', 'return import(p)');
        const mod = await dynImport("../../ckeditor5-custom-build/build/ckeditor");
        if (mounted) {
          // some custom builds export default, some export ClassicEditor named
          editorRef.current = (mod as any).default ?? (mod as any).ClassicEditor ?? mod;
          setEditorLoaded(true);
          return;
        }
      } catch {
        // ignore and fallback to standard build
      }

      try {
        const mod = await import("@ckeditor/ckeditor5-build-classic");
        if (mounted) {
          editorRef.current = (mod as any).default ?? mod;
          setEditorLoaded(true);
        }
      } catch {
        // swallow; editor will stay not loaded and a placeholder is shown
      }
    };

    void tryLoad();
    
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (_event: unknown, editorInstance: CKEditorInstance) => {
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
          <CKEditor 
            editor={editorRef.current} 
            data={content} 
            onChange={handleChange}
            // Cast to any to avoid overly strict EditorConfig typing differences between builds
            config={editorConfig as any}
          />
        ) : (
          <div className="p-4 text-sm text-gray-500">Loading editor…</div>
        )}
      </div>
    </>
  );
};

export default TextEditor;
