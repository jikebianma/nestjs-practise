import { Type } from '@nestjs/common';
import { ClassesType } from '../interface';
import { BaseUtil } from './base';
import { configure } from './configure';
import { UtilCollection } from './types';

/**
 * Util操作
 *
 * @export
 * @class UtilResolver
 */
export class UtilResolver {
    protected _utils: UtilCollection = [];

    /**
     * 实例化Util类并初始化,然后把对象放入_util属性进行注册其对象
     *
     * @template T
     * @template CT
     * @param {...ClassesType<T>} enabled
     * @returns
     * @memberof UtilResolver
     */
    add<T extends BaseUtil<CT>[], CT>(...enabled: ClassesType<T>) {
        for (const Item of enabled) {
            const util = new Item();
            util.factory(configure);
            this._utils.push({ provide: Item, useValue: util });
        }
        return this;
    }

    /**
     * 获取全部已注册的Util对象
     *
     * @readonly
     * @memberof UtilResolver
     */
    get all() {
        return this._utils;
    }

    /**
     * 获取一个Util的提供者对象用于注册提供者
     *
     * @template T
     * @template CT
     * @param {ClassType<T>} name
     * @returns
     * @memberof UtilResolver
     */
    provider<T extends BaseUtil<CT>, CT>(name: Type<T>) {
        return this._utils.find((item) => item.provide === name);
    }

    /**
     * 获取一个Util的实例
     *
     * @template T
     * @template CT
     * @param {ClassType<T>} name
     * @returns {T}
     * @memberof UtilResolver
     */
    get<T extends BaseUtil<CT>, CT>(name: Type<T>): T {
        const provider = this.provider(name);
        return provider?.useValue as T;
    }

    /**
     * 判断一个Util是否被注册
     *
     * @template T
     * @template CT
     * @param {ClassType<T>} name
     * @returns
     * @memberof UtilResolver
     */
    has<T extends BaseUtil<CT>, CT>(name: Type<T>) {
        const provider = this.provider(name);
        return !!provider;
    }
}
