import { Injectable, Logger } from '@nestjs/common';
import { PublicCacheService } from '../redis/public-cache.service';

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

const CACHE_TTL_SECONDS = 300;

@Injectable()
export class VideosService {
  private readonly logger = new Logger(VideosService.name);
  private readonly apiKey = process.env.YOUTUBE_API_KEY;

  constructor(private readonly publicCache: PublicCacheService) {}

  async searchVideos(query: string, maxResults = 10): Promise<VideoSearchResult[]> {
    const normalized = query.trim().toLowerCase();
    const cacheKey = `devtodev:public:videos:search:${normalized}`;

    const cached = await this.publicCache.get<VideoSearchResult[]>(cacheKey);
    if (cached) {
      return cached;
    }

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

      const results = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        provider: 'youtube',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));

      // Cache only real results; never cache the empty "no key" or error paths.
      if (results.length > 0) {
        await this.publicCache.set(cacheKey, results, CACHE_TTL_SECONDS);
      }

      return results;
    } catch (error) {
      this.logger.error('Error fetching videos from provider', error);
      return [];
    }
  }
}
