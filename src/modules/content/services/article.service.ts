import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { CreateArticleDto, UpdateArticleDto } from '../dtos';
import { Article } from '../entities';
import { ArticleRepository, CategoryRepository } from '../repositories';
import { CategoryService } from './category.service';

type FindParams = {
    category?: string;
};

type FindHook = (
    hookQuery: SelectQueryBuilder<Article>,
) => Promise<SelectQueryBuilder<Article>>;
@Injectable()
export class ArticleService {
    constructor(
        private categoryRepository: CategoryRepository,
        private articleRepository: ArticleRepository,
        private categoryService: CategoryService,
    ) {}

    async findList(params?: FindParams) {
        const query = await this.getQuery(params);
        return await query.getMany();
    }

    async findOne(id: string) {
        const query = await this.getQuery({}, async (called) => {
            return called.leftJoinAndSelect('a.comments', 'c');
        });
        return query.where('a.id = :id', { id }).getOne();
    }

    async findOneOrFail(id: string) {
        const item = await this.findOne(id);
        if (!item) throw new EntityNotFoundError(Article, id);
        return item;
    }

    async create(data: CreateArticleDto) {
        const item = await this.articleRepository.save(data);
        return this.findOneOrFail(item.id);
    }

    async update(data: UpdateArticleDto) {
        const article = await this.findOneOrFail(data.id);
        if (data.categories) {
            await this.articleRepository
                .createQueryBuilder()
                .relation(Article, 'categories')
                .of(article)
                .addAndRemove(data.categories, article.categories);
        }
        await this.articleRepository.save(data);
        return await this.findOneOrFail(data.id);
    }

    async delete(id: string) {
        const item = await this.findOneOrFail(id);
        return await this.articleRepository.remove(item);
    }

    /**
     * 根据条件获取文章查询的Query
     *
     * @protected
     * @param {FindParams} [params={}]
     * @param {FindHook} [callback]
     * @returns
     * @memberof ArticleService
     */
    protected async getQuery(params: FindParams = {}, callback?: FindHook) {
        let query = this.articleRepository
            .createQueryBuilder('a')
            .leftJoinAndSelect('a.categories', 'cat')
            .loadRelationCountAndMap('a.commentsCount', 'a.comments');
        if (callback) {
            query = await callback(query);
        }
        if (params?.category) {
            query = await this.queryByCategory(params.category, query);
        }
        return query;
    }

    /**
     * 查询出分类及其后代分类下的所有文章
     *
     * @param {string} id
     * @param {SelectQueryBuilder<Article>} query
     * @returns
     * @memberof ArticleService
     */
    async queryByCategory(id: string, query: SelectQueryBuilder<Article>) {
        const root = await this.categoryService.findOneOrFail(id);
        const tree = await this.categoryRepository.findDescendantsTree(root);
        const flatDes = await this.categoryService.toFlatTrees(tree.children);
        const ids = [tree.id, ...flatDes.map((item) => item.id)];
        return query.where('cat.id IN (:...ids)', {
            ids,
        });
    }
}
