import React from 'react';
import { Download } from 'lucide-react';
import { YouTubeComment } from '../types';

interface DownloadCommentsProps {
  comments: YouTubeComment[];
  isDark: boolean;
}

const DownloadComments: React.FC<DownloadCommentsProps> = ({ comments, isDark }) => {
  const handleDownload = () => {
    // Format comments into text
    const text = comments.map((comment, index) => {
      return `Comment #${index + 1}
Author: ${comment.authorName}
Posted: ${comment.publishedAt}
Likes: ${comment.likeCount}
Content: ${comment.textDisplay.replace(/<[^>]*>/g, '')}
Channel: ${comment.authorChannelUrl}
----------------------------------------
`;
    }).join('\n');

    // Create blob and download
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'youtube-comments.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={comments.length === 0}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isDark
          ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 disabled:bg-gray-900 disabled:text-gray-600'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 disabled:bg-gray-50 disabled:text-gray-400'
      }`}
    >
      <Download className="h-5 w-5" />
      <span>Download All Comments</span>
    </button>
  );
};

export default DownloadComments;