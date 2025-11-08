"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from 'next/dynamic';

// Use the official build to avoid mixing modular packages which can cause duplicated module errors.
export const RichTextEditor = dynamic(
  async () => {
    const { CKEditor } = await import('@ckeditor/ckeditor5-react');
    const ClassicEditor = (await import('@ckeditor/ckeditor5-build-classic')).default;

    return function Editor({ value, onChange, onBlur, placeholder }: {
      value: string;
      onChange: (v: string) => void;
      onBlur?: () => void;
      placeholder?: string;
    }) {
      const config = {
        placeholder: placeholder ?? 'Write your post...',
        toolbar: [
          'undo', 'redo', '|', 'heading', '|', 'bold', 'italic', 'link', 'blockQuote', '|',
          'bulletedList', 'numberedList', 'outdent', 'indent', '|', 'insertTable'
        ],
      };

      const EditorAny: any = ClassicEditor;

      return (
        <CKEditor
          editor={EditorAny}
          data={value}
          onChange={(_, editor) => onChange((editor as { getData: () => string }).getData())}
          onBlur={onBlur}
          config={config}
        />
      );
    };
  },
  { ssr: false }
);
