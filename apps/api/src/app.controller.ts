import { Controller, Get } from '@nestjs/common';
import axios from 'axios';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  async healthCheck() {
    let devMindStatus = 'unknown';
    try {
      const devMindUrl = process.env.DEV_MIND_URL || 'http://localhost:8000';
      const res = await axios.get(`${devMindUrl}/health`);
      devMindStatus = res.data.status === 'healthy' ? 'connected' : 'error';
    } catch (e) {
      devMindStatus = 'disconnected';
    }

    return {
      status: 'healthy',
      api: 'connected',
      devMind: devMindStatus,
      // Postgres and Redis are verified via nestjs lifecycle/config which we will wire later
    };
  }
}
