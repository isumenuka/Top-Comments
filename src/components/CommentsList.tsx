import React from 'react';
import { MessageSquare } from 'lucide-react';
import { YouTubeComment } from '../types';
import CommentCard from './CommentCard';
import DownloadComments from './DownloadComments';
import DownloadAllImages from './DownloadAllImages';

interface CommentsListProps {
  comments: YouTubeComment[];
  error: string | undefined;
  videoUrl: string | null;
  isDark: boolean;
}

const CommentsList: React.FC<CommentsListProps> = ({ comments, error, videoUrl, isDark }) => {
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-lg`}>
        <MessageSquare className="h-12 w-12 text-red-500 mb-2" />
        <h3 className={`text-xl font-semibold ${isDark ? 'text-red-400' : 'text-red-700'} mb-2`}>Error</h3>
        <p className={isDark ? 'text-red-400' : 'text-red-600'}>{error}</p>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <MessageSquare className={`h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'} mb-2`} />
        <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>No Comments Yet</h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Enter a YouTube video URL above to see its top comments</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg`}>
        <MessageSquare className={`h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'} mb-2`} />
        <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>No Comments Found</h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>This video might have comments disabled or no comments yet</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          Top {comments.length} Comments
        </h3>
        <div className="flex gap-2">
          <DownloadComments comments={comments} isDark={isDark} />
          <DownloadAllImages comments={comments} isDark={isDark} />
        </div>
      </div>
      
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <CommentCard key={comment.id} comment={comment} index={index} isDark={isDark} />
        ))}
      </div>
    </div>
  );
};

export default CommentsList;