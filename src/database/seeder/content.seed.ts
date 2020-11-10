import { BaseSeeder, DataFactory, panic } from '@/console/libs';
import { databasePath } from '@/core';
import { CategoryRepository } from '@/modules/content';
import { Article, Category, Comment } from '@/modules/content/entities';
import { User } from '@/modules/user/entities';
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

    private async genRandomComments(
        users: User[],
        article: Article,
        count: number,
        parent?: Comment,
    ) {
        const comments: Comment[] = [];
        for (let i = 0; i < count; i++) {
            const comment = new Comment();
            comment.body = faker.lorem.paragraph(
                Math.floor(Math.random() * 18) + 1,
            );
            comment.article = article;
            if (parent) {
                comment.parent = parent;
            }
            comment.creator = this.randItemData(users);
            comments.push(await this.em.save(comment));
            if (Math.random() >= 0.8) {
                comment.children = await this.genRandomComments(
                    users,
                    article,
                    Math.floor(Math.random() * 2),
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
        const allUsers = await this.em.find(User);
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
                author: (await this.em.findOne(User, {
                    where: { username: item.author },
                }))!,
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
                allUsers,
                article,
                Math.floor(Math.random() * 5),
            );
        }
        const redoms = await this.factory(Article)<IArticleFactoryOptions>({
            author: this.randItemData(await this.em.find(User)),
            categories: this.randListData(allCates),
        }).createMany(100);
        for (const redom of redoms) {
            await this.genRandomComments(
                allUsers,
                redom,
                Math.floor(Math.random() * 2),
            );
        }
    }
}
