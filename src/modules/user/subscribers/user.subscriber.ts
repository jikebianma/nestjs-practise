import { BaseSubscriber, encrypt } from '@/core';
import crypto from 'crypto';
import { EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { User } from '../entities/user.entity';

/**
 * 用户模型监听器
 *
 * @export
 * @class UserSubscriber
 * @implements {BaseSubscriber<User>}
 */
@EventSubscriber()
export class UserSubscriber extends BaseSubscriber<User> {
    listenTo() {
        return User;
    }

    /**
     * 生成不重复的随机用户名`
     *
     * @param {InsertEvent<User>} event
     * @returns {Promise<string>}
     * @memberof UserSubscriber
     */
    async generateUserName(event: InsertEvent<User>): Promise<string> {
        const username = `gkr_${crypto
            .randomBytes(4)
            .toString('hex')
            .slice(0, 8)}`;
        const user = await event.manager.findOne(User, {
            username,
        });
        return !user ? username : await this.generateUserName(event);
    }

    /**
     * 自动生成唯一用户名和密码
     *
     * @param {InsertEvent<User>} event
     * @memberof UserSubscriber
     */
    async beforeInsert(event: InsertEvent<User>) {
        // 自动生成唯一用户名
        if (!event.entity.username) {
            event.entity.username = await this.generateUserName(event);
        }
        // 自动生成密码
        if (!event.entity.password) {
            event.entity.password = crypto
                .randomBytes(11)
                .toString('hex')
                .slice(0, 22);
        }

        // 自动加密密码
        event.entity.password = encrypt(event.entity.password);
    }

    /**
     * 当密码更改时加密密码
     *
     * @param {UpdateEvent<User>} event
     * @memberof UserSubscriber
     */
    async beforeUpdate(event: UpdateEvent<User>) {
        if (this.isUpdated('password', event)) {
            event.entity.password = encrypt(event.entity.password);
        }
    }
}
