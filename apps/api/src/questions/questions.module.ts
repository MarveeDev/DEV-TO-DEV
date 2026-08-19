import { Module } from '@nestjs/common';
import { QuestionsController, AnswersController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SessionsModule } from '../sessions/sessions.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [PrismaModule, SessionsModule, MediaModule],
  controllers: [QuestionsController, AnswersController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
