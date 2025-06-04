import React from 'react';

interface SkeletonProps {
  count?: number;
  isDark?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ count = 3, isDark = false }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className={`${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } border rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}></div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/4 mb-2`}></div>
                <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/6`}></div>
              </div>
              <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
              <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full mb-2`}></div>
              <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-2/3`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;