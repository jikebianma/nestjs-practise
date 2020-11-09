import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dtos';
import { Comment } from '../entities';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
    ) {}

    async create(data: CreateCommentDto) {
        const item = await this.commentRepository.save(data);
        return this.commentRepository.findOneOrFail(item.id);
    }

    async delete(id: string) {
        const item = await this.commentRepository.findOneOrFail(id);
        return await this.commentRepository.remove(item);
    }
}
