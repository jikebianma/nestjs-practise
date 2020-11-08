import { BaseController } from '@/core';
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
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    ValidationPipe,
} from '@nestjs/common';

@Controller('articles')
export class ArticleController extends BaseController {
    constructor(private articleService: ArticleService) {
        super();
    }

    @Get()
    async index(
        @Query(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
            }),
        )
        { category }: QueryArticleDto,
    ) {
        return await this.articleService.findList({ category });
    }

    @Get(':id')
    async show(@Param('id', new ParseUUIDPipe()) id: string) {
        return await this.articleService.findOneOrFail(id);
    }

    @Post()
    async store(
        @Body(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                groups: ['create'],
            }),
        )
        data: CreateArticleDto,
    ) {
        return await this.articleService.create(data);
    }

    @Patch()
    async update(
        @Body(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                skipMissingProperties: true,
                groups: ['update'],
            }),
        )
        data: UpdateArticleDto,
    ) {
        return await this.articleService.update(data);
    }

    @Delete(':id')
    async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
        return await this.articleService.delete(id);
    }
}
