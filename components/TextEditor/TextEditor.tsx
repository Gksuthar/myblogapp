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

// Type for CKEditor instance
interface CKEditorInstance {
  getData: () => string;
}

// Type for ClassicEditor - using any due to complex CKEditor type definitions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassicEditorType = any;

const TextEditor: React.FC<WpCKEditorProps> = ({
  initialContent = "",
  onContentChange,
  label,
  required,
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [editorLoaded, setEditorLoaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          mode: 'manual',
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
    
    // Load standard ClassicEditor build
    // TODO: To enable alignment, uncomment below and add custom build:
    // const customBuildPath = "../ckeditor5-custom-build/build/ckeditor";
    // Promise.any([
    //   import(/* @vite-ignore */ customBuildPath).catch(() => null),
    //   import("@ckeditor/ckeditor5-build-classic")
    // ]).then((editorMod) => {
    //   if (mounted && editorMod) {
    //     editorRef.current = editorMod.default;
    //     setEditorLoaded(true);
    //   }
    // }).catch(() => {
    //   import("@ckeditor/ckeditor5-build-classic").then((mod) => {
    //     if (mounted) {
    //       editorRef.current = mod.default;
    //       setEditorLoaded(true);
    //     }
    //   });
    // });
    
    // Standard build (alignment not available)
    import("@ckeditor/ckeditor5-build-classic")
      .then((mod) => {
        if (mounted) {
          editorRef.current = mod.default;
          setEditorLoaded(true);
        }
      })
      .catch(() => {
        // Error handling
      });
    
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
            config={editorConfig}
          />
        ) : (
          <div className="p-4 text-sm text-gray-500">Loading editor…</div>
        )}
      </div>
    </>
  );
};

export default TextEditor;
