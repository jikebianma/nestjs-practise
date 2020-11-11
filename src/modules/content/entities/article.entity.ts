import { time } from '@/core';
import { User } from '@/modules/user/entities';
// import { User } from '@/modules/user/entities';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Comment } from './comment.entity';

/**
 * 文章模型
 *
 * @export
 * @class Article
 * @extends {BaseEntity}
 */
@Entity('content_articles')
export class Article extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: '文章标题' })
    title!: string;

    @Column({ comment: '文章内容', type: 'longtext' })
    body!: string;

    @Column({ comment: '文章描述', nullable: true })
    summary?: string;

    @Column({ comment: '关键字', type: 'simple-array', nullable: true })
    keywords?: string[];

    @Column({ comment: '是否发布', default: false })
    isPublished?: boolean;

    /**
     * 文章关联的分类
     *
     * @type {Category[]}
     * @memberof Article
     */
    @ManyToMany((type) => Category, (category) => category.articles, {
        cascade: true,
    })
    @JoinTable()
    categories!: Category[];

    /**
     * 文章下的评论
     *
     * @type {Comment[]}
     * @memberof Article
     */
    @OneToMany(() => Comment, (comment) => comment.article, { cascade: true })
    comments!: Comment[];

    @ManyToOne(() => User, (user) => user.articles, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    author!: User;

    @Column({
        comment: '发布时间',
        type: 'varchar',
        nullable: true,
        transformer: {
            from: (date) =>
                date ? time({ date }).format('YYYY-MM-DD HH:mm:ss') : null,
            to: (date?: Date | null) => date || null,
        },
    })
    publishedAt?: Date | null;

    @CreateDateColumn({
        comment: '创建时间',
        transformer: {
            from: (date) => time({ date }).format('YYYY-MM-DD HH:mm:ss'),
            to: (date) => date,
        },
    })
    createdAt!: Date;

    @UpdateDateColumn({
        comment: '更新时间',
        transformer: {
            from: (date) => time({ date }).format('YYYY-MM-DD HH:mm:ss'),
            to: (date) => date,
        },
    })
    updatedAt!: Date;
}
