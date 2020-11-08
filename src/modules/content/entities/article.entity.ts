import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Comment } from './comment.entity';

@Entity('content_articles')
export class Article extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: '文章标题' })
    title!: string;

    @Column({ comment: '文章内容', type: 'longtext' })
    body!: string;

    @Column({ comment: '文章描述', nullable: true })
    description?: string;

    @Column({ comment: '关键字', type: 'simple-array', nullable: true })
    keywords?: string[];

    @Column({ comment: '是否发布', default: false })
    isPublished?: boolean;

    @Column({
        comment: '发布时间',
        type: 'varchar',
        nullable: true,
    })
    published_at?: Date | null;

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

    @CreateDateColumn({
        comment: '创建时间',
    })
    created_at!: Date;

    @UpdateDateColumn({
        comment: '更新时间',
    })
    updated_at!: Date;
}
