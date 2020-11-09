import { BaseController, ParseUUIDEntityPipe } from '@/core';
import {
    CreateArticleDto,
    QueryArticleDto,
    UpdateArticleDto,
} from '@/modules/content/dtos';
import { ArticleService } from '@/modules/content/services';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { Article } from '../../entities';

@Controller('articles')
export class ArticleController extends BaseController {
    constructor(private articleService: ArticleService) {
        super();
    }

    @Get()
    async index(
        @Query()
        { category }: QueryArticleDto,
    ) {
        return await this.articleService.findList({ category });
    }

    @Get(':id')
    async show(
        @Param('id', new ParseUUIDEntityPipe(Article)) article: Article,
    ) {
        return await this.articleService.findOneOrFail(article.id);
    }

    @Post()
    async store(
        @Body()
        data: CreateArticleDto,
    ) {
        return await this.articleService.create(data);
    }

    @Patch()
    async update(
        @Body()
        data: UpdateArticleDto,
    ) {
        return await this.articleService.update(data);
    }

    @Delete(':id')
    async destroy(
        @Param('id', new ParseUUIDEntityPipe(Article)) article: Article,
    ) {
        return await this.articleService.delete(article.id);
    }
}
