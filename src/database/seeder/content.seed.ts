import { BaseSeeder, DataFactory, panic } from '@/console/libs';
import { databasePath } from '@/core';
import {
    Article,
    Category,
    CategoryRepository,
    Comment,
} from '@/modules/content';
import faker from 'faker';
import fs from 'fs';
import { Connection, In } from 'typeorm';
import { IArticleFactoryOptions } from '../factories/content.factory';
import {
    articles,
    categories,
    IArticleData,
    ICategoryData,
} from './data/content';

export default class ContentSeeder extends BaseSeeder {
    protected truncates = [Article, Category, Comment];

    protected factory!: DataFactory;

    public async run(
        _factory: DataFactory,
        _connection: Connection,
    ): Promise<any> {
        this.factory = _factory;
        await this.loadCategories(categories);
        await this.loadArticles(articles);
    }

    private getRandomCategories(cates: Category[]) {
        const getRandomIndex = () =>
            Math.floor(Math.random() * Math.floor(cates.length - 1));
        const result: Category[] = [];
        for (let i = 0; i <= getRandomIndex(); i++) {
            const cate = cates[getRandomIndex()];
            if (!result.find((item) => item.id === cate.id)) {
                result.push(cate);
            }
        }
        return result;
    }

    private async genRandomComments(
        article: Article,
        count: number,
        parent?: Comment,
    ) {
        const comments: Comment[] = [];
        for (let i = 0; i < count; i++) {
            const comment = new Comment();
            comment.body = faker.lorem.paragraph(
                Math.floor(Math.random() * 28) + 1,
            );
            comment.article = article;
            if (parent) {
                comment.parent = parent;
            }
            comments.push(await this.em.save(comment));
            if (Math.random() >= 0.8) {
                comment.children = await this.genRandomComments(
                    article,
                    Math.floor(Math.random() * 5) + 1,
                    comment,
                );
                await this.em.save(comment);
            }
        }
        return comments;
    }

    private async loadCategories(
        data: ICategoryData[],
        parent?: Category,
    ): Promise<void> {
        for (const item of data) {
            const category = new Category();
            category.name = item.name;
            if (parent) category.parent = parent;
            await this.em.save(category);
            if (item.children) {
                await this.loadCategories(item.children, category);
            }
        }
    }

    private async loadArticles(data: IArticleData[]) {
        const allCates = await this.em.find(Category);
        for (const item of data) {
            const contentPath = databasePath(
                `seeder/data/article-bodies/${item.contentFile}`,
            );
            if (
                !fs.existsSync(contentPath) ||
                !fs.statSync(contentPath).isFile()
            ) {
                panic(
                    this.spinner,
                    `article content file ${contentPath} not exits!`,
                );
            }
            const options: IArticleFactoryOptions = {
                title: item.title,
                body: fs.readFileSync(contentPath, 'utf8'),
                isPublished: true,
            };
            if (item.summary) {
                options.summary = item.summary;
            }
            if (item.categories) {
                options.categories = await this.em
                    .getCustomRepository(CategoryRepository)
                    .find({ where: { name: In(item.categories) } });
            }
            const article = await this.factory(Article)(options).create();
            await this.genRandomComments(
                article,
                Math.floor(Math.random() * 5) + 0,
            );
        }
        const redoms = await this.factory(Article)({
            categories: this.getRandomCategories(allCates),
        }).createMany(100);
        for (const redom of redoms) {
            await this.genRandomComments(
                redom,
                Math.floor(Math.random() * 5) + 0,
            );
        }
    }
}
