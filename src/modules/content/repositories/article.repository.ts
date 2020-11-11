import { EntityRepository, Repository } from 'typeorm';
import { Article, Comment } from '../entities';

/**
 * 自定义文章模型的Repository
 *
 * @export
 * @class ArticleRepository
 * @extends {Repository<Article>}
 */
@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {
    /**
     * 构建基础Query
     * 包括查询文章关联的作者以及评论数等
     *
     * @returns
     * @memberof ArticleRepository
     */
    buildBaseQuery() {
        return this.createQueryBuilder('article')
            .leftJoinAndSelect('article.author', 'author')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(c.id)', 'count')
                    .from(Comment, 'c')
                    .where('c.article.id = article.id');
            }, 'commentCount')
            .loadRelationCountAndMap(
                'article.commentCount',
                'article.comments',
            );
    }
}
