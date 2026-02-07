import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/hooks/useImageUpload';
import { toast } from 'sonner';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success('图片上传成功');
    } catch (err) {
      toast.error('图片上传失败：' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {value ? (
        <div className="relative rounded-lg overflow-hidden border">
          <img src={value} alt="封面图" className="w-full h-48 object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={() => onChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">
            {uploading ? '上传中...' : '点击或拖拽上传封面图'}
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
