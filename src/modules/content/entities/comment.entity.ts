import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';
import { Article } from './article.entity';

@Entity('content_comments')
@Tree('nested-set')
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: '评论内容' })
    body!: string;

    @TreeChildren()
    children!: Comment[];

    @TreeParent()
    parent?: Comment;

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
}
