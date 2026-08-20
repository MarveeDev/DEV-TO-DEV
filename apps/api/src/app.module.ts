import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

import { SessionsModule } from './sessions/sessions.module';

import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ConnectionsModule } from './connections/connections.module';
import { DevelopersModule } from './developers/developers.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';
import { ScoreModule } from './score/score.module';
import { ProjectsModule } from './projects/projects.module';

import { QuestionsModule } from './questions/questions.module';
import { RoadmapsModule } from './roadmaps/roadmaps.module';
import { SkillsModule } from './skills/skills.module';
import { MediaModule } from './media/media.module';
import { TrendingModule } from './trending/trending.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [PrismaModule, RedisModule, SessionsModule, AuthModule, ProfileModule, ConnectionsModule, DevelopersModule, NotificationsModule, PostsModule, ScoreModule, ProjectsModule, QuestionsModule, RoadmapsModule, SkillsModule, MediaModule, TrendingModule, VideosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
