import { Module } from '@nestjs/common';
import { RoadmapsController } from './roadmaps.controller';
import { RoadmapsService } from './roadmaps.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [PrismaModule, SessionsModule],
  controllers: [RoadmapsController],
  providers: [RoadmapsService],
})
export class RoadmapsModule {}
