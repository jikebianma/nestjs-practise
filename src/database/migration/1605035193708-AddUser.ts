import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUser1605035193708 implements MigrationInterface {
    name = 'AddUser1605035193708';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TABLE `user_refresh_tokens` (`id` varchar(36) NOT NULL, `value` varchar(500) NOT NULL, `expired_at` varchar(255) NOT NULL COMMENT '令牌过期时间', `created_at` datetime(6) NOT NULL COMMENT '令牌创建时间' DEFAULT CURRENT_TIMESTAMP(6), `accessTokenId` varchar(36) NULL, UNIQUE INDEX `REL_1dfd080c2abf42198691b60ae3` (`accessTokenId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
        );
        await queryRunner.query(
            "CREATE TABLE `users` (`id` varchar(36) NOT NULL, `nickname` varchar(255) NULL COMMENT '姓名', `username` varchar(255) NOT NULL COMMENT '用户名', `password` varchar(500) NOT NULL COMMENT '密码', `phone` varchar(255) NULL COMMENT '手机号', `email` varchar(255) NULL COMMENT '邮箱', `actived` tinyint NOT NULL COMMENT '用户状态,是否激活' DEFAULT 1, `created_at` datetime(6) NOT NULL COMMENT '用户创建时间' DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_fe0bb3f6520ee0469504521e71` (`username`), UNIQUE INDEX `IDX_a000cca60bcf04454e72769949` (`phone`), UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
        );
        await queryRunner.query(
            "CREATE TABLE `user_access_tokens` (`id` varchar(36) NOT NULL, `value` varchar(500) NOT NULL, `expired_at` varchar(255) NOT NULL COMMENT '令牌过期时间', `created_at` datetime(6) NOT NULL COMMENT '令牌创建时间' DEFAULT CURRENT_TIMESTAMP(6), `userId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
        );
        await queryRunner.query(
            'ALTER TABLE `content_comments` ADD `userId` varchar(36) NULL',
        );
        await queryRunner.query(
            'ALTER TABLE `content_articles` ADD `authorId` varchar(36) NULL',
        );
        await queryRunner.query(
            'ALTER TABLE `user_refresh_tokens` ADD CONSTRAINT `FK_1dfd080c2abf42198691b60ae39` FOREIGN KEY (`accessTokenId`) REFERENCES `user_access_tokens`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE `user_access_tokens` ADD CONSTRAINT `FK_71a030e491d5c8547fc1e38ef82` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE `content_comments` ADD CONSTRAINT `FK_3ec3e32832bd75f0fe472f2cc03` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE `content_articles` ADD CONSTRAINT `FK_6331273633bc2e4a25a8a039282` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `content_articles` DROP FOREIGN KEY `FK_6331273633bc2e4a25a8a039282`',
        );
        await queryRunner.query(
            'ALTER TABLE `content_comments` DROP FOREIGN KEY `FK_3ec3e32832bd75f0fe472f2cc03`',
        );
        await queryRunner.query(
            'ALTER TABLE `user_access_tokens` DROP FOREIGN KEY `FK_71a030e491d5c8547fc1e38ef82`',
        );
        await queryRunner.query(
            'ALTER TABLE `user_refresh_tokens` DROP FOREIGN KEY `FK_1dfd080c2abf42198691b60ae39`',
        );
        await queryRunner.query(
            'ALTER TABLE `content_articles` DROP COLUMN `authorId`',
        );
        await queryRunner.query(
            'ALTER TABLE `content_comments` DROP COLUMN `userId`',
        );
        await queryRunner.query('DROP TABLE `user_access_tokens`');
        await queryRunner.query(
            'DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`',
        );
        await queryRunner.query(
            'DROP INDEX `IDX_a000cca60bcf04454e72769949` ON `users`',
        );
        await queryRunner.query(
            'DROP INDEX `IDX_fe0bb3f6520ee0469504521e71` ON `users`',
        );
        await queryRunner.query('DROP TABLE `users`');
        await queryRunner.query(
            'DROP INDEX `REL_1dfd080c2abf42198691b60ae3` ON `user_refresh_tokens`',
        );
        await queryRunner.query('DROP TABLE `user_refresh_tokens`');
    }
}
