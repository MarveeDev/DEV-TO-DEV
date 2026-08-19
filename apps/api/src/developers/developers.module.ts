import { Module } from '@nestjs/common';
import { DevelopersController } from './developers.controller';
import { DevelopersService } from './developers.service';
import { MatchingService } from './matching.service';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [DevelopersController],
  providers: [DevelopersService, MatchingService],
  exports: [MatchingService],
})
export class DevelopersModule {}
