import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { YouTubeComment } from '../types';
import { toPng } from 'html-to-image';
import { formatDate } from '../utils/helpers';

interface DownloadAllImagesProps {
  comments: YouTubeComment[];
  isDark: boolean;
}

const DownloadAllImages: React.FC<DownloadAllImagesProps> = ({ comments, isDark }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    const zip = new JSZip();
    
    try {
      // Create a container for comments
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 800px;
        padding: 24px;
        background: ${isDark ? '#1f2937' : '#ffffff'};
        border-radius: 16px;
      `;
      document.body.appendChild(container);

      // Process each comment
      for (const comment of comments) {
        // Create temporary comment element
        const commentElement = document.createElement('div');
        commentElement.className = `${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } border rounded-2xl p-6 shadow-lg`;
        container.appendChild(commentElement);

        // Format date for filename
        const date = new Date(comment.publishedAt);
        const formattedDate = date.toISOString().split('T')[0];

        // Add comment content
        commentElement.innerHTML = `
          <div class="flex items-start gap-4">
            <img 
              src="${comment.authorProfileImageUrl}" 
              alt="${comment.authorName}'s profile"
              class="w-12 h-12 rounded-full object-cover"
              crossorigin="anonymous"
            />
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <a href="${comment.authorChannelUrl}" class="font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}">
                  ${comment.authorName}
                </a>
                <div class="flex items-center gap-2">
                  <span class="${isDark ? 'text-gray-300' : 'text-gray-700'}">${comment.likeCount} likes</span>
                  <span class="${isDark ? 'text-gray-300' : 'text-gray-700'}">${formatDate(comment.publishedAt)}</span>
                </div>
              </div>
              <div class="${isDark ? 'text-gray-300' : 'text-gray-700'} mt-2">
                ${comment.textDisplay}
              </div>
            </div>
          </div>
        `;

        // Wait for images to load
        const images = commentElement.getElementsByTagName('img');
        await Promise.all(
          Array.from(images).map(img => 
            new Promise((resolve, reject) => {
              img.crossOrigin = 'anonymous';
              if (img.complete) resolve(null);
              img.onload = () => resolve(null);
              img.onerror = () => reject(new Error('Image failed to load'));
            })
          )
        );

        // Convert to PNG and add to ZIP
        const dataUrl = await toPng(commentElement, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
          skipAutoScale: true
        });

        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        
        // Add to ZIP with date in filename
        zip.file(`${formattedDate}-comment-${comment.id}.png`, blob, { binary: true });
        
        // Clean up
        container.removeChild(commentElement);
      }

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = 'youtube-comments.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);

      // Final cleanup
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error downloading comments:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownloadAll}
      disabled={comments.length === 0 || isDownloading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isDark
          ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 disabled:bg-gray-900 disabled:text-gray-600'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 disabled:bg-gray-50 disabled:text-gray-400'
      }`}
    >
      {isDownloading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Download className="h-5 w-5" />
      )}
      <span>{isDownloading ? 'Creating ZIP...' : 'Download All Images'}</span>
    </button>
  );
};

export default DownloadAllImages;