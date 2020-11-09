import { BaseSubscriber, time } from '@/core';
import { EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Article } from '../entities';

@EventSubscriber()
export class ArticleSubscriber extends BaseSubscriber<Article> {
    /**
     * 在当前链接中添加
     *
     * @param {Connection} connection
     * @memberof CategorySubscriber
     */
    listenTo() {
        return Article;
    }

    async beforeInsert(event: InsertEvent<Article>) {
        if (event.entity.isPublished) {
            event.entity.published_at = time().toDate();
        }
    }

    async beforeUpdate(event: UpdateEvent<Article>) {
        if (this.isUpdated('isPublished', event)) {
            event.entity.published_at = event.entity.isPublished
                ? time().toDate()
                : null;
        }
    }
}
