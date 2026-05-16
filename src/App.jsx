import { useState, useCallback } from 'react';
import { FileText, Zap } from 'lucide-react';
import UrlInput from './components/UrlInput';
import ArticleDisplay from './components/ArticleDisplay';
import { generateArticle } from './services/api';

export default function App() {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = useCallback(async (url) => {
    setIsGenerating(true);
    setContent('');
    setError('');

    try {
      const stream = await generateArticle(url);
      const reader = stream.getReader();
      const decoder = new TextDecoder('utf-8');
      let totalContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        totalContent += chunk;
        setContent(totalContent);
      }

      if (!totalContent.trim()) {
        throw new Error('生成的文章内容为空，请尝试其他视频');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Subtitle Flow</h1>
              <p className="text-sm text-gray-500">YouTube字幕文章生成器</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              将YouTube视频转化为精美文章
            </h2>
            <p className="text-gray-500 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              输入视频链接，AI自动生成结构化中文文章
            </p>
          </div>
          
          <UrlInput onSubmit={handleGenerate} isLoading={isGenerating} />
        </section>

        {error && (
          <div className="mb-8 px-6 py-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            <strong>错误:</strong> {error}
          </div>
        )}

        <section>
          <ArticleDisplay content={content} isGenerating={isGenerating} />
        </section>
      </main>

      <footer className="mt-16 py-8 border-t border-gray-100 bg-white/50">
        <div className="max-w-4xl mx-auto px-6 text-center text-gray-400 text-sm">
          Powered by Gemini AI • Built with React & Cloudflare
        </div>
      </footer>
    </div>
  );
}
