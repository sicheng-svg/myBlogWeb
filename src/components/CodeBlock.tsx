import { useState, useRef, type HTMLAttributes } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/components/ui/utils';

export function CodeBlock({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <button
        onClick={handleCopy}
        className={cn(
          'absolute top-3 right-3 p-2 rounded-lg z-10',
          'bg-gray-700/80 hover:bg-gray-600 text-gray-300 hover:text-white',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          'backdrop-blur-sm border border-gray-600/50'
        )}
        title="复制代码"
        aria-label="复制代码"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      <pre
        ref={preRef}
        className={cn('rounded-xl overflow-x-auto', className)}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
