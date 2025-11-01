'use client'
import dynamic from 'next/dynamic';

export const RichTextEditor = dynamic(
  async () => {
    const { CKEditor } = await import('@ckeditor/ckeditor5-react');
    const ClassicEditor = (await import('@ckeditor/ckeditor5-build-classic')).default;

    // ✅ Fix the type issue by casting to any
    const SafeClassicEditor: any = ClassicEditor;

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
      return (
        <CKEditor
          editor={SafeClassicEditor} // ✅ fixed type
          data={value}
          onChange={(_, editor: any) => onChange(editor.getData())}
          onBlur={onBlur}
          config={{
            placeholder: placeholder ?? 'Write your post...',
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
              'bulletedList',
              'numberedList',
              'outdent',
              'indent',
              '|',
              'insertTable',
            ],
          }}
        />
      );
    };
  },
  { ssr: false }
);
