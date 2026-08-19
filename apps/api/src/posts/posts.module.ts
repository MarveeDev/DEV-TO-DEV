import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SessionsModule } from '../sessions/sessions.module';
import { ScoreModule } from '../score/score.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [SessionsModule, ScoreModule, MediaModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
