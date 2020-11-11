import { BaseSubscriber } from '@/core';
import crypto from 'crypto';
import { EventSubscriber, InsertEvent } from 'typeorm';
import { Category } from '../entities';

/**
 * 分类模型观察者
 *
 * @export
 * @class CategorySubscriber
 * @extends {BaseSubscriber<Category>}
 */
@EventSubscriber()
export class CategorySubscriber extends BaseSubscriber<Category> {
    listenTo() {
        return Category;
    }

    /**
     * 在添加分类时,如果没有设置slug则自动生成一个唯一值的slug
     *
     * @param {InsertEvent<Category>} event
     * @memberof CategorySubscriber
     */
    async beforeInsert(event: InsertEvent<Category>) {
        if (!event.entity.slug) {
            event.entity.slug = await this.generateUniqueSlug(event);
        }
    }

    /**
     * 为slug生成唯一值
     *
     * @param {InsertEvent<Category>} event
     * @returns {Promise<string>}
     * @memberof CategorySubscriber
     */
    async generateUniqueSlug(event: InsertEvent<Category>): Promise<string> {
        const slug = `gkr_${crypto.randomBytes(4).toString('hex').slice(0, 8)}`;
        const category = await event.manager.findOne(Category, {
            slug,
        });
        return !category ? slug : await this.generateUniqueSlug(event);
    }
}
