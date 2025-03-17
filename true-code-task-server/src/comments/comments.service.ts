import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CommentBaseDto, CommentDto } from './comment.schemas';
import { Comment } from './comment.entity';
import { CommentFile } from './comment-file.entity';
import { Pageable, TransactionService } from 'src/common';

@Injectable()
export class CommentsService {
  constructor(private readonly transactionService: TransactionService) {}

  async getComments(
    author: string,
    page: number = 0,
    size: number = 3,
    sortField?: string,
    sortDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Pageable<CommentDto>> {
    try {
      const comments = await Comment.find({
        where: {
          author: author,
        },
        relations: ['files'],
        skip: page * size,
        take: size,
        order: sortField ? { [sortField]: sortDirection } : {},
      });

      const total = await Comment.count();

      return {
        items: comments.map(({ id, author, message, publish_at, files }) => ({
          id,
          author,
          message,
          publish_at,
          fileIds: files.map((el) => el.fileId),
        })),
        total,
      };
    } catch (e) {
      throw new InternalServerErrorException('Ошибка получения данных');
    }
  }

  async getComment(commentId: number): Promise<CommentDto> {
    try {
      const commentEnt = await Comment.findOne({
        where: { id: commentId },
        relations: ['files'],
      });

      if (!commentEnt) {
        throw new NotFoundException('Комментарий не найден');
      }

      const { id, author, message, publish_at, files } = commentEnt;
      return {
        id,
        author,
        message,
        publish_at,
        fileIds: files.map((el) => el.fileId),
      };
    } catch {
      throw new InternalServerErrorException('Ошибка получения данных');
    }
  }

  async addComment(author: string, comment: CommentBaseDto): Promise<CommentDto> {
    return this.transactionService.runInTransaction(async (queryRunner) => {
      const commentEnt = queryRunner.manager.create(Comment, {
        message: comment.message,
        author: author,
        publish_at: new Date(),
      });
      await queryRunner.manager.save(commentEnt);

      if (comment.fileIds?.length) {
        const files = comment.fileIds.map((fileId) =>
          queryRunner.manager.create(CommentFile, {
            fileId,
            commentId: commentEnt.id,
          }),
        );
        await queryRunner.manager.save(files);
      }

      return commentEnt;
    });
  }

  async updateComment(commentId: number, comment: CommentBaseDto): Promise<CommentDto> {
    return this.transactionService.runInTransaction(async (queryRunner) => {
      const commentEnt: Comment = await queryRunner.manager.findOne(Comment, {
        where: { id: commentId },
        relations: ['files'],
      });

      if (!commentEnt) {
        throw new NotFoundException('Комментарий не найден');
      }

      commentEnt.message = comment.message;
      await queryRunner.manager.save(commentEnt);

      const existingFileIds = commentEnt.files.map((file) => file.fileId);

      const filesToAdd = comment.fileIds?.filter((id) => !existingFileIds.includes(id));
      const filesToRemove = existingFileIds?.filter((id) => !comment.fileIds?.includes(id));

      if (filesToAdd?.length) {
        const newFiles: CommentFile[] = filesToAdd.map((fileId) =>
          queryRunner.manager.create(CommentFile, { fileId, commentId }),
        );
        await queryRunner.manager.save(newFiles);
      }

      if (filesToRemove.length) {
        filesToRemove.forEach(async (fileId) => {
          await queryRunner.manager.delete(CommentFile, {
            fileId,
            commentId,
          });
        });
      }

      return commentEnt;
    });
  }

  async deleteComment(commentId: number): Promise<{ message: string }> {
    return this.transactionService.runInTransaction(async (queryRunner) => {
      const commentEnt: Comment = await queryRunner.manager.findOne(Comment, {
        where: { id: commentId },
        relations: ['files'],
      });

      if (!commentEnt) {
        throw new NotFoundException('Комментарий не найден');
      }

      commentEnt.files.forEach(async (file) => {
        await queryRunner.manager.delete(CommentFile, {
          fileId: file.fileId,
          commentId,
        });
      });

      const result = await queryRunner.manager.delete(Comment, commentId);

      return { message: 'Комментарий удален' };
    });
  }
}
