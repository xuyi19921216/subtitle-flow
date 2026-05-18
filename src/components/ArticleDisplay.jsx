import { useState, useRef, useEffect } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

function parseMarkdown(text) {
  let html = text;
  
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-5">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-12 mb-6">$1</h1>');
  
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-gray-700">$1</li>');
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-700">$1</li>');
  
  const lines = html.split('\n');
  let result = '';
  let inList = false;
  
  for (const line of lines) {
    if (line.startsWith('<li>')) {
      if (!inList) {
        result += '<ul class="list-disc space-y-2 mb-6">';
        inList = true;
      }
      result += line + '\n';
    } else {
      if (inList) {
        result += '</ul>\n';
        inList = false;
      }
      if (line.startsWith('<h') || line === '') {
        result += line + '\n';
      } else {
        result += `<p class="text-gray-700 leading-relaxed mb-5">${line}</p>\n`;
      }
    }
  }
  
  if (inList) {
    result += '</ul>\n';
  }
  
  return result;
}

export default function ArticleDisplay({ content, isGenerating }) {
  const [copied, setCopied] = useState(false);
  const displayRef = useRef(null);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [content]);

  const handleCopy = async () => {
    try {
      const textContent = displayRef.current?.innerText || content;
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  if (!content && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Sparkles className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg">输入YouTube链接开始生成文章</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          生成的文章
        </h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-gray-700"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">复制内容</span>
            </>
          )}
        </button>
      </div>
      
      <div
        ref={displayRef}
        className="bg-white rounded-xl shadow-lg p-8 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
      />
      
      {isGenerating && (
        <div className="flex items-center justify-center mt-4 text-indigo-500">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">AI正在生成中...</span>
          </span>
        </div>
      )}
    </div>
  );
}
