import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';
import { Article } from './article.entity';

/**
 * 分类模型
 *
 * @export
 * @class Category
 * @extends {BaseEntity}
 */
@Entity('content_categories')
@Tree('nested-set')
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: '分类名称' })
    name!: string;

    @Column({ comment: '分类标识符' })
    slug!: string;

    @Column({ comment: '分类排序' })
    order: number = 0;

    @TreeChildren()
    children!: Category[];

    @TreeParent()
    parent?: Category;

    /**
     * 分类嵌套等级,只在打平时使用
     *
     * @type {number}
     * @memberof Category
     */
    level: number = 0;

    /**
     * 分类关联的文章
     *
     * @type {Article[]}
     * @memberof Category
     */
    @ManyToMany((type) => Article, (article) => article.categories)
    articles!: Article[];
}
