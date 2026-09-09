import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { SessionsModule } from '../sessions/sessions.module';
import { ScoreModule } from '../score/score.module';

@Module({
  imports: [SessionsModule, ScoreModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
