import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Request, Res } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Pageable, withInputExceptionHandler, WithTokenGuard } from 'src/common';
import {
  CommentsQueryDto,
  CommentDto,
  CommentBaseDto,
  CommentsQuerySchema,
  CommentIdSchema,
  CommentBaseSchema,
} from './comment.schemas';

import { Response } from 'express';

@Controller('api/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  @UseGuards(WithTokenGuard)
  async getComments(
    @Request() req,
    @Query() query: CommentsQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Pageable<CommentDto>> {
    return withInputExceptionHandler(async () => {
      const { page, size, sortField, sortDirection } = CommentsQuerySchema.parse(query);
      return await this.commentsService.getComments(req.user.uid, page, size, sortField, sortDirection);
    }, res);
  }

  @Get(':commentId')
  @UseGuards(WithTokenGuard)
  async getComment(
    @Param('commentId') commentId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommentDto> {
    return withInputExceptionHandler(async () => {
      const id = CommentIdSchema.parse(commentId);
      return await this.commentsService.getComment(id);
    }, res);
  }

  @Post()
  @UseGuards(WithTokenGuard)
  async addComment(
    @Request() req,
    @Body() comment: CommentBaseDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommentDto> {
    return withInputExceptionHandler(async () => {
      const validatedComment = CommentBaseSchema.parse(comment);
      return await this.commentsService.addComment(req.user.uid, validatedComment);
    }, res);
  }

  @Put(':commentId')
  @UseGuards(WithTokenGuard)
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() comment: CommentBaseDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommentDto> {
    return withInputExceptionHandler(async () => {
      const id = CommentIdSchema.parse(commentId);
      const validatedComment = CommentBaseSchema.parse(comment);
      return await this.commentsService.updateComment(id, validatedComment);
    }, res);
  }

  @Delete(':commentId')
  @UseGuards(WithTokenGuard)
  async deleteComment(
    @Param('commentId') commentId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    return withInputExceptionHandler(async () => {
      const id = CommentIdSchema.parse(commentId);
      return await this.commentsService.deleteComment(id);
    }, res);
  }
}
