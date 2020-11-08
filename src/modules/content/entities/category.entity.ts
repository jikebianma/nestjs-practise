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

@Entity('content_categories')
@Tree('nested-set')
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: '分类名称' })
    name!: string;

    @Column({ comment: '分类标识符' })
    slug!: string;

    @TreeChildren()
    children!: Category[];

    @TreeParent()
    parent?: Category;

    /**
     * 分类关联的文章
     *
     * @type {Article[]}
     * @memberof Category
     */
    @ManyToMany((type) => Article, (article) => article.categories)
    articles!: Article[];
}
