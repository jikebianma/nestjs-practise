import { defineFactory } from '@/console/libs';
import { Article, Category, Comment } from '@/modules/content/entities';
import { User } from '@/modules/user/entities';
// import { User } from '@/modules/user/entities';
import Faker from 'faker';

export type IArticleFactoryOptions = Partial<{
    title: string;
    summary: string;
    body: string;
    isPublished: boolean;
    categories: Category[];
    comments: Comment[];
}> & {
    author: User;
};
defineFactory(
    Article,
    async (faker: typeof Faker, options?: IArticleFactoryOptions) => {
        if (!options?.author) {
            throw new Error('author must been specify!');
        }
        faker.setLocale('zh_CN');
        const article = new Article();
        article.title =
            options.title ??
            faker.lorem.sentence(Math.floor(Math.random() * 10) + 6);
        if (options.summary) {
            article.summary = options.summary;
        }
        article.body =
            options.body ??
            faker.lorem.paragraph(Math.floor(Math.random() * 500) + 1);
        article.isPublished = article.isPublished ?? Math.random() >= 0.5;
        article.author = options.author!;
        if (options.categories) {
            article.categories = options.categories;
        }
        return article;
    },
);
