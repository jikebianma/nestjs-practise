import { defineFactory } from '@/console/libs';
import { Article, Category, Comment } from '@/modules/content';
import Faker from 'faker';

export type IArticleFactoryOptions = Partial<{
    title: string;
    summary: string;
    body: string;
    isPublished: boolean;
    categories: Category[];
    comments: Comment[];
}>;
defineFactory(
    Article,
    async (faker: typeof Faker, settings: IArticleFactoryOptions = {}) => {
        faker.setLocale('zh_CN');
        const article = new Article();
        article.title =
            settings.title ??
            faker.lorem.sentence(Math.floor(Math.random() * 10) + 6);
        if (settings.summary) {
            article.summary = settings.summary;
        }
        article.body =
            article.body ??
            faker.lorem.paragraph(Math.floor(Math.random() * 500) + 1);
        article.isPublished = article.isPublished ?? Math.random() >= 0.5;
        if (settings.categories) {
            article.categories = settings.categories;
        }
        return article;
    },
);
