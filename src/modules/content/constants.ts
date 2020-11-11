/**
 * 文章排序类型
 *
 * @export
 * @enum {number}
 */
export enum ArticleOrderType {
    CREATED = 'createdAt',
    UPDATED = 'updatedAt',
    PUBLISHED = 'publishedAt',
    COMMENTCOUNT = 'commentCount',
}
