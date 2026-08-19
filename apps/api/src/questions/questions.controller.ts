import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { VoteDto } from './dto/vote.dto';
import { SessionsService } from '../sessions/sessions.service';

async function getUserIdOrThrow(req: Request, sessionsService: SessionsService): Promise<string> {
  const token = req.cookies['session_id'];
  if (!token) throw new UnauthorizedException();
  const userId = await sessionsService.validateSession(token);
  if (!userId) throw new UnauthorizedException();
  return userId;
}

@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Get()
  async getQuestions(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('skill') skill?: string,
    @Query('filter') filter?: string,
    @Query('sort') sort?: string
  ) {
    return this.questionsService.getQuestions({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search,
      status,
      skill,
      filter,
      sort
    });
  }

  @Get(':id')
  async getQuestionById(@Param('id') id: string) {
    return this.questionsService.getQuestionById(id);
  }

  @Post()
  async createQuestion(@Req() req: Request, @Body() data: CreateQuestionDto) {
    const userId = await getUserIdOrThrow(req, this.sessionsService);
    return this.questionsService.createQuestion(userId, data);
  }

  @Patch(':id')
  async updateQuestion(@Req() req: Request, @Param('id') id: string, @Body() data: UpdateQuestionDto) {
    const userId = await getUserIdOrThrow(req, this.sessionsService);
    return this.questionsService.updateQuestion(userId, id, data);
  }

  @Delete(':id')
  async deleteQuestion(@Req() req: Request, @Param('id') id: string) {
    const userId = await getUserIdOrThrow(req, this.sessionsService);
    return this.questionsService.deleteQuestion(userId, id);
  }

  @Post(':id/vote')
  async voteQuestion(@Req() req: Request, @Param('id') id: string, @Body() data: VoteDto) {
    const userId = await getUserIdOrThrow(req, this.sessionsService);
    return this.questionsService.voteQuestion(userId, id, data.value);
  }

  @Post(':id/answers')
  async createAnswer(@Req() req: Request, @Param('id') id: string, @Body() data: CreateAnswerDto) {
    const userId = await getUserIdOrThrow(req, this.sessionsService);
    return this.questionsService.createAnswer(userId, id, data.content);
  }

  @Post(':id/answers/:answerId/accept')
  async acceptAnswer(@Req() req: Request, @Param('id') id: string, @Param('answerId') answerId: string) {
    const userId = await getUserIdOrThrow(req, this.sessionsService);
    return this.questionsService.acceptAnswer(userId, id, answerId);
  }

  @Post(':id/resolve')
  async resolveQuestion(@Req() req: Request, @Param('id') id: string) {
    const userId = await getUserIdOrThrow(req, this.sessionsService);
    return this.questionsService.resolveQuestion(userId, id);
  }
}

@Controller('answers')
export class AnswersController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Patch(':id')
  async updateAnswer(@Req() req: Request, @Param('id') id: string, @Body() data: UpdateAnswerDto) {
    const userId = await getUserIdOrThrow(req, this.sessionsService);
    if (!data.content) throw new BadRequestException('Content is required');
    return this.questionsService.updateAnswer(userId, id, data.content);
  }

  @Delete(':id')
  async deleteAnswer(@Req() req: Request, @Param('id') id: string) {
    const userId = await getUserIdOrThrow(req, this.sessionsService);
    return this.questionsService.deleteAnswer(userId, id);
  }

  @Post(':id/vote')
  async voteAnswer(@Req() req: Request, @Param('id') id: string, @Body() data: VoteDto) {
    const userId = await getUserIdOrThrow(req, this.sessionsService);
    return this.questionsService.voteAnswer(userId, id, data.value);
  }
}
