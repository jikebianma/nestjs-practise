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

/**
 * 文章管理控制器
 *
 * @export
 * @class ArticleController
 * @extends {BaseController}
 */
@Controller('articles')
export class ArticleController extends BaseController {
    constructor(private articleService: ArticleService) {
        super();
    }

    /**
     * 文章列表
     *
     * @param {QueryArticleDto} { page, limit, ...params }
     * @returns
     * @memberof ArticleController
     */
    @Get()
    async index(
        @Query()
        { page, limit, ...params }: QueryArticleDto,
    ) {
        return await this.articleService.paginate(params, { page, limit });
    }

    /**
     * 文章详细信息
     *
     * @param {Article} article
     * @returns
     * @memberof ArticleController
     */
    @Get(':id')
    async show(
        @Param('id', new ParseUUIDEntityPipe(Article)) article: Article,
    ) {
        return await this.articleService.findOne(article.id);
    }

    /**
     * 添加文章
     *
     * @param {CreateArticleDto} data
     * @param {User} user
     * @returns
     * @memberof ArticleController
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async store(
        @Body()
        data: CreateArticleDto,
        @ReqUser() user: User,
    ) {
        return await this.articleService.create(data, user);
    }

    /**
     * 更新文章
     *
     * @param {UpdateArticleDto} data
     * @returns
     * @memberof ArticleController
     */
    @Patch()
    @UseGuards(JwtAuthGuard)
    async update(
        @Body()
        data: UpdateArticleDto,
    ) {
        return await this.articleService.update(data);
    }

    /**
     * 删除文章
     *
     * @param {Article} article
     * @returns
     * @memberof ArticleController
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async destroy(
        @Param('id', new ParseUUIDEntityPipe(Article)) article: Article,
    ) {
        return await this.articleService.delete(article.id);
    }
}
