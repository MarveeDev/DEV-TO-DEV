import { Controller, Get, Post, Patch, Delete, Body, Param, Req, Query, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { MarketplaceService } from './marketplace.service';
import { SessionsService } from '../sessions/sessions.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('marketplace')
export class MarketplaceController {
  constructor(
    private readonly marketplaceService: MarketplaceService,
    private readonly sessionsService: SessionsService,
  ) {}

  private async getUserId(req: Request) {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();
    return userId;
  }

  @Get()
  async findAll(@Query('category') category?: string, @Query('type') type?: string, @Query('search') search?: string) {
    return this.marketplaceService.findAll({ category, type, search });
  }

  @Get('me')
  async findMyListings(@Req() req: Request) {
    const userId = await this.getUserId(req);
    return this.marketplaceService.findMyListings(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.marketplaceService.findOne(id);
  }

  @Post()
  async createListing(@Req() req: Request, @Body() data: CreateListingDto) {
    const userId = await this.getUserId(req);
    return this.marketplaceService.createListing(userId, data);
  }

  @Patch(':id')
  async updateListing(@Req() req: Request, @Param('id') id: string, @Body() data: UpdateListingDto) {
    const userId = await this.getUserId(req);
    return this.marketplaceService.updateListing(userId, id, data);
  }

  @Delete(':id')
  async deleteListing(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserId(req);
    return this.marketplaceService.deleteListing(userId, id);
  }

  @Post('listings/:id/report')
  async reportListing(@Req() req: Request, @Param('id') id: string, @Body() data: CreateReportDto) {
    const userId = await this.getUserId(req);
    return this.marketplaceService.reportListing(userId, id, data);
  }
}
