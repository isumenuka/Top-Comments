export interface YouTubeComment {
  id: string;
  authorName: string;
  authorProfileImageUrl: string;
  authorChannelUrl: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
}

export interface FetchCommentsResponse {
  comments: YouTubeComment[];
  error?: string;
}