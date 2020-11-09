import { BaseController, ParseUUIDEntityPipe } from '@/core';
import { CreateCommentDto } from '@/modules/content/dtos';
import { CommentService } from '@/modules/content/services';
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Comment } from '../../entities';

@Controller('comments')
export class CommentController extends BaseController {
    constructor(private commentService: CommentService) {
        super();
    }

    @Post()
    async store(
        @Body()
        data: CreateCommentDto,
    ) {
        return await this.commentService.create(data);
    }

    @Delete(':id')
    async destroy(
        @Param('id', new ParseUUIDEntityPipe(Comment)) comment: Comment,
    ) {
        return this.commentService.delete(comment.id);
    }
}
