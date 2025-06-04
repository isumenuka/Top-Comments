import React from 'react';
import { extractVideoId } from '../utils/helpers';

interface VideoPreviewProps {
  url: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ url }) => {
  const videoId = extractVideoId(url);
  
  if (!videoId) return null;
  
  return (
    <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden shadow-md">
      <div className="aspect-video w-full">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPreview;