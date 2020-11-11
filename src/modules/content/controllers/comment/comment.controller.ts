import { BaseController, ParseUUIDEntityPipe } from '@/core';
import { CreateCommentDto } from '@/modules/content/dtos';
import { CommentService } from '@/modules/content/services';
import { JwtAuthGuard, ReqUser } from '@/modules/user';
import { User } from '@/modules/user/entities';
import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { Comment } from '../../entities';

/**
 * 评论管理控制器
 *
 * @export
 * @class CommentController
 * @extends {BaseController}
 */
@Controller('comments')
export class CommentController extends BaseController {
    constructor(private commentService: CommentService) {
        super();
    }

    /**
     * 添加评论
     *
     * @param {CreateCommentDto} data
     * @param {User} user
     * @returns
     * @memberof CommentController
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async store(
        @Body()
        data: CreateCommentDto,
        @ReqUser() user: User,
    ) {
        return await this.commentService.create(data, user);
    }

    /**
     * 删除评论
     *
     * @param {Comment} comment
     * @returns
     * @memberof CommentController
     */
    @Delete(':id')
    // @UseGuards(JwtAuthGuard)
    async destroy(
        @Param('id', new ParseUUIDEntityPipe(Comment)) comment: Comment,
    ) {
        return this.commentService.delete(comment.id);
    }
}
