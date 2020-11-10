import { BaseController, ParseUUIDEntityPipe } from '@/core';
import {
    CreateArticleDto,
    QueryArticleDto,
    UpdateArticleDto,
} from '@/modules/content/dtos';
import { JwtAuthGuard, ReqUser } from '@/modules/user';
import { User } from '@/modules/user/entities';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { Article } from '../../entities';
import { ArticleService } from '../../services';

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
    @UseGuards(JwtAuthGuard)
    async store(
        @Body()
        data: CreateArticleDto,
        @ReqUser() user: User,
    ) {
        return await this.articleService.create(data, user);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async update(
        @Body()
        data: UpdateArticleDto,
    ) {
        return await this.articleService.update(data);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async destroy(
        @Param('id', new ParseUUIDEntityPipe(Article)) article: Article,
    ) {
        return await this.articleService.delete(article.id);
    }
}
