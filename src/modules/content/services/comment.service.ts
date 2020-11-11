import { User } from '@/modules/user/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dtos';
import { Comment } from '../entities';

/**
 * 文章评论服务
 *
 * @export
 * @class CommentService
 */
@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
    ) {}

    /**
     * 发表评论
     *
     * @param {CreateCommentDto} data
     * @param {User} user
     * @returns
     * @memberof CommentService
     */
    async create(data: CreateCommentDto, user: User) {
        const item = await this.commentRepository.save({
            ...data,
            creator: user,
        });
        return this.commentRepository.findOneOrFail(item.id);
    }

    /**
     * 删除评论
     *
     * @param {string} id
     * @returns
     * @memberof CommentService
     */
    async delete(id: string) {
        const item = await this.commentRepository.findOneOrFail(id);
        return await this.commentRepository.remove(item);
    }
}
