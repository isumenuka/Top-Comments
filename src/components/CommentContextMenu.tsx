import React, { useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { YouTubeComment } from '../types';

interface CommentContextMenuProps {
  comment: YouTubeComment;
  x: number;
  y: number;
  onClose: () => void;
  commentRef: React.RefObject<HTMLDivElement>;
  isDark: boolean;
}

const CommentContextMenu: React.FC<CommentContextMenuProps> = ({ 
  comment, 
  x, 
  y, 
  onClose,
  commentRef,
  isDark
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!commentRef.current) return;

    try {
      const node = commentRef.current;
      
      // Create a temporary container
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: ${node.offsetWidth}px;
        padding: 24px;
        background: ${isDark ? '#1f2937' : '#ffffff'};
        border-radius: 16px;
      `;
      
      // Clone the node
      const clone = node.cloneNode(true) as HTMLElement;
      
      // Ensure all images have crossOrigin set
      const images = clone.getElementsByTagName('img');
      for (let i = 0; i < images.length; i++) {
        images[i].crossOrigin = 'anonymous';
      }
      
      // Add clone to container
      container.appendChild(clone);
      document.body.appendChild(container);

      // Wait for images to load
      await Promise.all(
        Array.from(clone.getElementsByTagName('img')).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            setTimeout(reject, 5000);
          });
        })
      );

      // Generate PNG
      const dataUrl = await toPng(container, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        skipAutoScale: true,
        style: {
          transform: 'none',
          opacity: '1'
        }
      });
      
      // Cleanup
      document.body.removeChild(container);
      
      // Download
      const link = document.createElement('a');
      link.download = `comment-${comment.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading comment:', err);
    }
    
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={`fixed ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } rounded-lg shadow-lg border py-1 z-50`}
      style={{
        left: x,
        top: y,
      }}
    >
      <button
        onClick={handleDownload}
        className={`w-full px-4 py-2 text-left text-sm ${
          isDark 
            ? 'hover:bg-gray-700 text-gray-200' 
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        Download as PNG
      </button>
    </div>
  );
};

export default CommentContextMenu;