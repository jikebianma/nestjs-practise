import { time } from '@/core';
import { User } from '@/modules/user/entities';
// import { User } from '@/modules/user/entities';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';
import { Article } from './article.entity';

/**
 * 评论模型
 *
 * @export
 * @class Comment
 * @extends {BaseEntity}
 */
@Entity('content_comments')
@Tree('nested-set')
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: '评论内容', type: 'longtext' })
    body!: string;

    @TreeChildren()
    children!: Comment[];

    @TreeParent()
    parent?: Comment;

    @ManyToOne(() => User, (user) => user.comments)
    creator!: User;

    /**
     * 评论所属文章
     *
     * @type {Article}
     * @memberof Comment
     */
    @ManyToOne(() => Article, (article) => article.comments, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    article!: Article;

    @CreateDateColumn({
        comment: '创建时间',
        transformer: {
            from: (date) => time({ date }).format('YYYY-MM-DD HH:mm:ss'),
            to: (date) => date,
        },
    })
    createdAt!: Date;
}
