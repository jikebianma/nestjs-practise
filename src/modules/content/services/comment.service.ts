import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dtos';
import { Article, Comment } from '../entities';
import { ArticleRepository } from '../repositories';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        private articleRepository: ArticleRepository,
    ) {}

    async create(createDto: CreateCommentDto) {
        const { article, ...createData } = createDto;
        const data: Omit<CreateCommentDto, 'article'> & {
            article?: Article;
        } = { ...createData };
        if (article) {
            data.article = await this.articleRepository.findOneOrFail(article);
        }
        const item = await this.commentRepository.save(data);
        return this.commentRepository.findOneOrFail(item.id);
    }

    async delete(id: string) {
        const item = await this.commentRepository.findOneOrFail(id);
        return await this.commentRepository.remove(item);
    }
}
