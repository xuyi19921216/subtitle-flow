import { useState } from 'react';
import { Play, Loader2, ArrowRight } from 'lucide-react';

function isValidYouTubeUrl(url) {
  const patterns = [
    /youtube\.com\/watch\?v=/,
    /youtube\.com\/embed\//,
    /youtu\.be\//,
    /youtube\.com\/v\//,
  ];
  return patterns.some(pattern => pattern.test(url));
}

export default function UrlInput({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('请输入YouTube视频链接');
      return;
    }
    
    if (!isValidYouTubeUrl(url)) {
      setError('请输入有效的YouTube链接');
      return;
    }
    
    setError('');
    await onSubmit(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-500 to-red-600">
            <Play className="w-6 h-6 text-white" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            placeholder="输入 YouTube 视频链接..."
            disabled={isLoading}
            className="flex-1 px-4 py-4 text-gray-800 placeholder-gray-400 bg-transparent outline-none font-medium"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-r-xl transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>生成</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 animate-fadeIn">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
