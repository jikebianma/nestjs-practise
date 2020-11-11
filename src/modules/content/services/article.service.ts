import { QueryHook } from '@/core';
import { User } from '@/modules/user/entities';
import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { ArticleOrderType } from '../constants';
import { CreateArticleDto, QueryArticleDto, UpdateArticleDto } from '../dtos';
import { Article } from '../entities';
import { ArticleRepository, CategoryRepository } from '../repositories';
import { CategoryService } from './category.service';

// 文章查询接口
type FindParams = {
    [key in keyof Omit<
        QueryArticleDto,
        'limit' | 'page'
    >]: QueryArticleDto[key];
};

/**
 * 文章服务
 *
 * @export
 * @class ArticleService
 */
@Injectable()
export class ArticleService {
    constructor(
        private categoryRepository: CategoryRepository,
        private articleRepository: ArticleRepository,
        private categoryService: CategoryService,
    ) {}

    /**
     * 查询文章列表,分页输出数据
     *
     * @param {FindParams} params
     * @param {IPaginationOptions} options
     * @returns
     * @memberof ArticleService
     */
    async paginate(params: FindParams, options: IPaginationOptions) {
        const query = await this.getListQuery(params);
        return await paginate<Article>(query, options);
    }

    /**
     * 查询一篇文章的详细信息
     *
     * @param {string} id
     * @returns
     * @memberof ArticleService
     */
    async findOne(id: string) {
        const query = await this.getItemQuery();
        const item = await query.where('article.id = :id', { id }).getOne();
        if (!item) throw new EntityNotFoundError(Article, id);
        return item;
    }

    /**
     * 添加文章
     *
     * @param {CreateArticleDto} data
     * @param {User} user
     * @returns
     * @memberof ArticleService
     */
    async create(data: CreateArticleDto, user: User) {
        const item = await this.articleRepository.save({
            ...data,
            author: user,
        });
        return this.findOne(item.id);
    }

    /**
     * 更新文章
     *
     * @param {UpdateArticleDto} data
     * @returns
     * @memberof ArticleService
     */
    async update(data: UpdateArticleDto) {
        const article = await this.findOne(data.id);
        if (data.categories) {
            await this.articleRepository
                .buildBaseQuery()
                .relation(Article, 'categories')
                .of(article)
                .addAndRemove(data.categories, article.categories);
        }
        await this.articleRepository.save(data);
        return await this.findOne(data.id);
    }

    /**
     * 删除文章
     *
     * @param {string} id
     * @returns
     * @memberof ArticleService
     */
    async delete(id: string) {
        const item = await this.findOne(id);
        return await this.articleRepository.remove(item);
    }

    /**
     * 查询一篇文章的Query构建
     *
     * @protected
     * @param {QueryHook<Article>} [callback]
     * @returns
     * @memberof ArticleService
     */
    protected async getItemQuery(callback?: QueryHook<Article>) {
        let query = this.articleRepository
            .buildBaseQuery()
            .leftJoinAndSelect('article.comments', 'comments')
            .leftJoinAndSelect('comments.creator', 'creator');
        if (callback) {
            query = await callback(query);
        }
        return query;
    }

    /**
     * 根据条件查询文章列表的Query构建
     *
     * @protected
     * @param {FindParams} [params={}]
     * @param {FindHook} [callback]
     * @returns
     * @memberof ArticleService
     */
    protected async getListQuery(
        params: FindParams = {},
        callback?: QueryHook<Article>,
    ) {
        const { category, orderBy, isPublished } = params;
        let query = this.articleRepository
            .buildBaseQuery()
            .leftJoinAndSelect('article.categories', 'categories');
        if (isPublished !== undefined && typeof isPublished === 'boolean') {
            query = query.where('a.isPublished = :isPublished', {
                isPublished,
            });
        }
        query = this.queryOrderBy(query, orderBy);
        if (callback) {
            query = await callback(query);
        }
        if (category) {
            query = await this.queryByCategory(category, query);
        }
        return query;
    }

    /**
     * 对文章进行排序的Query构建
     *
     * @protected
     * @param {SelectQueryBuilder<Article>} query
     * @param {ArticleOrderType} [orderBy]
     * @returns
     * @memberof ArticleService
     */
    protected queryOrderBy(
        query: SelectQueryBuilder<Article>,
        orderBy?: ArticleOrderType,
    ) {
        switch (orderBy) {
            case ArticleOrderType.CREATED:
                return query.orderBy('article.createdAt', 'DESC');
            case ArticleOrderType.UPDATED:
                return query.orderBy('article.updatedAt', 'DESC');
            case ArticleOrderType.PUBLISHED:
                return query.orderBy('article.publishedAt', 'DESC');
            case ArticleOrderType.COMMENTCOUNT:
                return query.orderBy('commentCount', 'DESC');
            default:
                return query
                    .orderBy('article.createdAt', 'DESC')
                    .addOrderBy('article.updatedAt', 'DESC')
                    .addOrderBy('article.publishedAt', 'DESC')
                    .addOrderBy('commentCount', 'DESC');
        }
    }

    /**
     * 查询出分类及其后代分类下的所有文章的Query构建
     *
     * @param {string} id
     * @param {SelectQueryBuilder<Article>} query
     * @returns
     * @memberof ArticleService
     */
    async queryByCategory(id: string, query: SelectQueryBuilder<Article>) {
        const root = await this.categoryService.findOne(id);
        const tree = await this.categoryRepository.findDescendantsTree(root);
        const flatDes = await this.categoryRepository.toFlatTrees(
            tree.children,
        );
        const ids = [tree.id, ...flatDes.map((item) => item.id)];
        return query.where('categories.id IN (:...ids)', {
            ids,
        });
    }
}
