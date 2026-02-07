import MDEditor from '@uiw/react-md-editor';
import { uploadImage } from '@/hooks/useImageUpload';
import { toast } from 'sonner';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;

        try {
          toast.info('正在上传图片...');
          const url = await uploadImage(file);
          onChange(value + `\n![image](${url})\n`);
          toast.success('图片已插入');
        } catch (err) {
          toast.error('图片上传失败：' + (err as Error).message);
        }
        return;
      }
    }
  };

  return (
    <div data-color-mode="light" onPaste={handlePaste}>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={500}
        preview="live"
      />
    </div>
  );
}
