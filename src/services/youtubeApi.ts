import axios from 'axios';
import { FetchCommentsResponse, YouTubeComment } from '../types';
import { extractVideoId } from '../utils/helpers';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const MAX_COMMENTS = 20;

/**
 * Fetch the top comments from a YouTube video
 */
export const fetchTopComments = async (url: string): Promise<FetchCommentsResponse> => {
  try {
    if (!API_KEY) {
      return { 
        comments: [],
        error: 'YouTube API key is not configured. Please check your environment variables.' 
      };
    }
    
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return { 
        comments: [],
        error: 'Invalid YouTube URL. Please enter a valid YouTube video URL.' 
      };
    }
    
    // First, get the comments thread
    const commentsResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/commentThreads',
      {
        params: {
          part: 'snippet,replies',
          videoId,
          key: API_KEY,
          order: 'relevance', // This tends to return top comments first
          maxResults: 100 // Get more to ensure we can find ones with likes
        }
      }
    );

    if (!commentsResponse.data.items || commentsResponse.data.items.length === 0) {
      return { 
        comments: [],
        error: 'No comments found for this video or comments might be disabled.' 
      };
    }

    // Extract comment data and sort by like count
    const comments: YouTubeComment[] = commentsResponse.data.items
      .map((item: any) => {
        const snippet = item.snippet.topLevelComment.snippet;
        return {
          id: item.id,
          authorName: snippet.authorDisplayName,
          authorProfileImageUrl: snippet.authorProfileImageUrl,
          authorChannelUrl: snippet.authorChannelUrl,
          textDisplay: snippet.textDisplay,
          likeCount: snippet.likeCount,
          publishedAt: snippet.publishedAt
        };
      })
      .sort((a: YouTubeComment, b: YouTubeComment) => b.likeCount - a.likeCount)
      .slice(0, MAX_COMMENTS);

    return { comments };
  } catch (error) {
    console.error('Error fetching YouTube comments:', error);
    let errorMessage = 'Failed to fetch comments. Please try again later.';
    
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 403) {
        errorMessage = 'API quota exceeded or unauthorized. Please try again later.';
      } else if (error.response.status === 404) {
        errorMessage = 'Video not found. Please check the URL and try again.';
      }
    }
    
    return { 
      comments: [],
      error: errorMessage
    };
  }
};
