import { Module } from '@nestjs/common';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [ScoreController],
  providers: [ScoreService],
  exports: [ScoreService], // Export so other modules can use it
})
export class ScoreModule {}
