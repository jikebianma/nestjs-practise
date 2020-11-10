import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMG1604958366514 implements MigrationInterface {
    name = 'FirstMG1604958366514';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TABLE `content_categories` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL COMMENT '分类名称', `slug` varchar(255) NOT NULL COMMENT '分类标识符', `nsleft` int NOT NULL DEFAULT '1', `nsright` int NOT NULL DEFAULT '2', `parentId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
        );
        await queryRunner.query(
            "CREATE TABLE `content_comments` (`id` varchar(36) NOT NULL, `body` longtext NOT NULL COMMENT '评论内容', `created_at` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `nsleft` int NOT NULL DEFAULT '1', `nsright` int NOT NULL DEFAULT '2', `parentId` varchar(36) NULL, `articleId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
        );
        await queryRunner.query(
            "CREATE TABLE `content_articles` (`id` varchar(36) NOT NULL, `title` varchar(255) NOT NULL COMMENT '文章标题', `body` longtext NOT NULL COMMENT '文章内容', `summary` varchar(255) NULL COMMENT '文章描述', `keywords` text NULL COMMENT '关键字', `isPublished` tinyint NOT NULL COMMENT '是否发布' DEFAULT 0, `published_at` varchar(255) NULL COMMENT '发布时间', `created_at` datetime(6) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
        );
        await queryRunner.query(
            'CREATE TABLE `content_articles_categories_content_categories` (`contentArticlesId` varchar(36) NOT NULL, `contentCategoriesId` varchar(36) NOT NULL, INDEX `IDX_846f629ca6267d4cdb5a75aa20` (`contentArticlesId`), INDEX `IDX_88bf82882d68b1cbb1b7b376ee` (`contentCategoriesId`), PRIMARY KEY (`contentArticlesId`, `contentCategoriesId`)) ENGINE=InnoDB',
        );
        await queryRunner.query(
            'ALTER TABLE `content_categories` ADD CONSTRAINT `FK_a03aea27707893300382b6f18ae` FOREIGN KEY (`parentId`) REFERENCES `content_categories`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE `content_comments` ADD CONSTRAINT `FK_982a849f676860e5d6beb607f20` FOREIGN KEY (`parentId`) REFERENCES `content_comments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE `content_comments` ADD CONSTRAINT `FK_1efe70f49c8472a5ee0c3dc2c4c` FOREIGN KEY (`articleId`) REFERENCES `content_articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
        );
        await queryRunner.query(
            'ALTER TABLE `content_articles_categories_content_categories` ADD CONSTRAINT `FK_846f629ca6267d4cdb5a75aa20d` FOREIGN KEY (`contentArticlesId`) REFERENCES `content_articles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE `content_articles_categories_content_categories` ADD CONSTRAINT `FK_88bf82882d68b1cbb1b7b376ee6` FOREIGN KEY (`contentCategoriesId`) REFERENCES `content_categories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `content_articles_categories_content_categories` DROP FOREIGN KEY `FK_88bf82882d68b1cbb1b7b376ee6`',
        );
        await queryRunner.query(
            'ALTER TABLE `content_articles_categories_content_categories` DROP FOREIGN KEY `FK_846f629ca6267d4cdb5a75aa20d`',
        );
        await queryRunner.query(
            'ALTER TABLE `content_comments` DROP FOREIGN KEY `FK_1efe70f49c8472a5ee0c3dc2c4c`',
        );
        await queryRunner.query(
            'ALTER TABLE `content_comments` DROP FOREIGN KEY `FK_982a849f676860e5d6beb607f20`',
        );
        await queryRunner.query(
            'ALTER TABLE `content_categories` DROP FOREIGN KEY `FK_a03aea27707893300382b6f18ae`',
        );
        await queryRunner.query(
            'DROP INDEX `IDX_88bf82882d68b1cbb1b7b376ee` ON `content_articles_categories_content_categories`',
        );
        await queryRunner.query(
            'DROP INDEX `IDX_846f629ca6267d4cdb5a75aa20` ON `content_articles_categories_content_categories`',
        );
        await queryRunner.query(
            'DROP TABLE `content_articles_categories_content_categories`',
        );
        await queryRunner.query('DROP TABLE `content_articles`');
        await queryRunner.query('DROP TABLE `content_comments`');
        await queryRunner.query('DROP TABLE `content_categories`');
    }
}
