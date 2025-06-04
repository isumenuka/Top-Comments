import React, { useState } from 'react';
import VideoForm from './components/VideoForm';
import CommentsList from './components/CommentsList';
import VideoPreview from './components/VideoPreview';
import Skeleton from './components/Skeleton';
import { fetchTopComments } from './services/youtubeApi';
import { YouTubeComment } from './types';
import { Github, Sun, Moon } from 'lucide-react';

function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [comments, setComments] = useState<YouTubeComment[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setVideoUrl(url);
    setError(undefined);
    
    try {
      const result = await fetchTopComments(url);
      
      if (result.error) {
        setError(result.error);
      } else {
        setComments(result.comments);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error in handleSubmit:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${isDark ? 'bg-gray-800 shadow-gray-900' : 'bg-white'} shadow-sm transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-red-600">YouTube Top Comments</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-gray-300" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                aria-label="View source code on GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VideoForm onSubmit={handleSubmit} isLoading={isLoading} isDark={isDark} />
        
        {videoUrl && !error && (
          <VideoPreview url={videoUrl} />
        )}
        
        {isLoading ? (
          <Skeleton count={5} isDark={isDark} />
        ) : (
          <CommentsList 
            comments={comments} 
            error={error}
            videoUrl={videoUrl}
            isDark={isDark}
          />
        )}
      </main>
      
      <footer className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-12 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
            YouTube Top Comments Viewer &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;