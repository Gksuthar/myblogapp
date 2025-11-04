'use client'
import dynamic from 'next/dynamic';
import 'ckeditor5/ckeditor5.css';

export const RichTextEditor = dynamic(
  async () => {
    const { CKEditor } = await import('@ckeditor/ckeditor5-react');
    // Use modular CKEditor to avoid duplicated modules. Import required editor and plugins from 'ckeditor5'.
    const {
      ClassicEditor,
      Essentials,
      Paragraph,
      Heading,
      Bold,
      Italic,
      Link,
      BlockQuote,
      List,
      Indent,
      Table,
      TableToolbar,
      Alignment,
    } = await import('ckeditor5');
    // Using modular CKEditor: Alignment comes from 'ckeditor5' and will be enabled via config.plugins

    return function Editor({
      value,
      onChange,
      onBlur,
      placeholder,
    }: {
      value: string;
      onChange: (v: string) => void;
      onBlur?: () => void;
      placeholder?: string;
    }) {
      const config = {
        placeholder: placeholder ?? 'Write your post...',
        plugins: [
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Link,
          BlockQuote,
          List,
          Indent,
          Table,
          TableToolbar,
          Alignment,
        ],
        toolbar: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'blockQuote',
          '|',
          'alignment',
          '|',
          'bulletedList',
          'numberedList',
          'outdent',
          'indent',
          '|',
          'insertTable',
        ],
      };

      return (
        <CKEditor
          editor={ClassicEditor}
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
