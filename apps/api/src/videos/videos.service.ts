import { Injectable, Logger } from '@nestjs/common';

export interface VideoSearchResult {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  provider: 'youtube' | 'curated';
  url: string;
}

@Injectable()
export class VideosService {
  private readonly logger = new Logger(VideosService.name);
  private readonly apiKey = process.env.YOUTUBE_API_KEY;

  async searchVideos(query: string, maxResults = 10): Promise<VideoSearchResult[]> {
    if (!this.apiKey) {
      this.logger.warn('YOUTUBE_API_KEY is not configured. Returning empty results.');
      // Fallback for when no API key is available during local dev
      return [];
    }

    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.append('part', 'snippet');
      url.searchParams.append('maxResults', maxResults.toString());
      url.searchParams.append('q', query);
      url.searchParams.append('type', 'video');
      // Technology context only
      url.searchParams.append('videoCategoryId', '28'); // Science & Technology
      url.searchParams.append('key', this.apiKey);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
      }

      const data = await response.json();

      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        provider: 'youtube',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));
    } catch (error) {
      this.logger.error('Error fetching videos from provider', error);
      return [];
    }
  }
}
