import React, { useState } from 'react';
import { Search, Youtube, Loader2 } from 'lucide-react';

interface VideoFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  isDark: boolean;
}

const VideoForm: React.FC<VideoFormProps> = ({ onSubmit, isLoading, isDark }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }
    
    if (!url.includes('youtube.com/watch') && !url.includes('youtu.be/')) {
      setError('Please enter a valid YouTube video URL');
      return;
    }
    
    setError('');
    onSubmit(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-center mb-6">
        <Youtube className="h-8 w-8 text-red-600 mr-2" />
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Top Comments Viewer
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube video URL here"
            className={`w-full p-4 pr-12 border-2 rounded-lg focus:outline-none transition-colors ${
              isDark 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
            }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
            aria-label="Search for comments"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-red-600 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
};

export default VideoForm;