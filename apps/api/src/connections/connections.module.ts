import { Module } from '@nestjs/common';
import { ConnectionsController } from './connections.controller';
import { ConnectionsService } from './connections.service';
import { SessionsModule } from '../sessions/sessions.module';
import { ScoreModule } from '../score/score.module';

@Module({
  imports: [SessionsModule, ScoreModule],
  controllers: [ConnectionsController],
  providers: [ConnectionsService],
})
export class ConnectionsModule {}
