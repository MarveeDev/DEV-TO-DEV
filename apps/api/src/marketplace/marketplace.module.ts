import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
})
export class MarketplaceModule {}
