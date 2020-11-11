import { BaseSubscriber, time } from '@/core';
import { EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Article } from '../entities';

/**
 * 文章模型观察者
 *
 * @export
 * @class ArticleSubscriber
 * @extends {BaseSubscriber<Article>}
 */
@EventSubscriber()
export class ArticleSubscriber extends BaseSubscriber<Article> {
    listenTo() {
        return Article;
    }

    /**
     * 如果在添加文章的同时发布文章,则设置当前时间为发布时间
     *
     * @param {InsertEvent<Article>} event
     * @memberof ArticleSubscriber
     */
    async beforeInsert(event: InsertEvent<Article>) {
        if (event.entity.isPublished) {
            event.entity.publishedAt = time().toDate();
        }
    }

    /**
     * 更改发布状态会同时更新发布时间的值,
     * 如果文章更新为未发布状态,则把发布时间设置为null
     *
     * @param {UpdateEvent<Article>} event
     * @memberof ArticleSubscriber
     */
    async beforeUpdate(event: UpdateEvent<Article>) {
        if (this.isUpdated('isPublished', event)) {
            event.entity.publishedAt = event.entity.isPublished
                ? time().toDate()
                : null;
        }
    }
}
