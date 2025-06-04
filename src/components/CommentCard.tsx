import React, { useRef, useState } from 'react';
import { ThumbsUp, Clock, Download } from 'lucide-react';
import { YouTubeComment } from '../types';
import { formatNumber, formatDate } from '../utils/helpers';
import { downloadCommentAsImage } from '../utils/download';

interface CommentCardProps {
  comment: YouTubeComment;
  index: number;
  isDark: boolean;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, index, isDark }) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!commentRef.current) return;
    setIsDownloading(true);
    try {
      await downloadCommentAsImage(commentRef.current, comment.id, isDark);
    } catch (err) {
      console.error('Error downloading comment:', err);
    }
    setIsDownloading(false);
  };

  const createMarkup = () => {
    return { __html: comment.textDisplay };
  };

  return (
    <div 
      ref={commentRef}
      className={`${
        isDark 
          ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900' 
          : 'bg-white border-gray-200 hover:shadow-xl'
      } border rounded-2xl p-6 shadow-lg transition-all duration-300 overflow-hidden relative`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4">
        <img 
          src={comment.authorProfileImageUrl} 
          alt={`${comment.authorName}'s profile`}
          className={`w-12 h-12 rounded-full object-cover ring-2 ${isDark ? 'ring-gray-700' : 'ring-gray-100'}`}
          crossOrigin="anonymous"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <a 
              href={comment.authorChannelUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`font-semibold hover:text-red-600 transition-colors truncate ${isDark ? 'text-gray-200' : 'text-gray-900'}`}
            >
              {comment.authorName}
            </a>
            
            <div className="flex items-center gap-2">
              <div className={`flex items-center px-3 py-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <ThumbsUp className="h-4 w-4 mr-2 text-red-500" />
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{formatNumber(comment.likeCount)}</span>
              </div>
              
              <div className={`flex items-center px-3 py-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <Clock className="h-4 w-4 mr-2 text-red-500" />
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{formatDate(comment.publishedAt)}</span>
              </div>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`flex items-center px-3 py-1 rounded-full transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                title="Download comment as image"
              >
                <Download className={`h-4 w-4 ${isDownloading ? 'animate-bounce' : ''} text-red-500`} />
              </button>
            </div>
          </div>
          
          <div 
            className={`mt-4 comment-text text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            dangerouslySetInnerHTML={createMarkup()}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentCard;