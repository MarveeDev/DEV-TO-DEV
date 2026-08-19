import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
  }

  onModuleDestroy() {
    this.client?.quit();
  }

  getClient(): Redis {
    return this.client;
  }
}
