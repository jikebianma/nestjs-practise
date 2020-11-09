import {
    Connection,
    ConnectionOptions,
    getConnectionManager,
    ObjectType,
} from 'typeorm';
import { Gkr } from '../gkr';
import { DbOption } from '../interface';
import { Database } from '../utils';

const db = () => Gkr.util.get(Database);

/// -------------------------------------------------------------------------
// 全局变量用于存储当前数据库连接
// -------------------------------------------------------------------------
(global as any).db = {
    name: 'default',
    connection: undefined,
};

/**
 * 获取所有数据库的连接配置
 *
 * @export
 * @template T
 * @returns {T[]}
 */
export function dbOptions<T extends DbOption = DbOption>(): T[] {
    return db().getOptions<T>();
}

/**
 * 通过名称获取一个数据库的连接配置
 *
 * @export
 * @template T
 * @param {string} [name]
 * @returns {T}
 */
export function dbOption<T extends DbOption = DbOption>(name?: string): T {
    return db().getOption<T>(name);
}

/**
 * 获取所有数据库连接名
 *
 * @export
 * @returns {string[]}
 */
export function dbNames(): string[] {
    return db().names;
}

/**
 * 获取默认数据库连接名
 *
 * @export
 * @returns {string}
 */
export function defaultDbName(): string {
    return db().default;
}

/**
 * 获取Entity类名
 *
 * @export
 * @template T
 * @param {ObjectType<T>} entity
 * @returns {string}
 */
export function entityName<T>(entity: ObjectType<T>): string {
    if (entity instanceof Function) {
        return entity.name;
    }
    if (entity) {
        return new (entity as any)().constructor.name;
    }
    throw new Error('Enity is not defined');
}

/**
 * 创建一个临时连接
 * 主要用于CLI操作
 *
 * @export
 * @param {string} [name]
 * @returns {Promise<Connection>}
 */
export function makeConnection(name?: string): Promise<Connection> {
    const option = db().getOption(name);
    return getConnectionManager()
        .create(option as ConnectionOptions)
        .connect();
}

/**
 * 设置当前连接及当前连接的名称
 *
 * @export
 * @param {{
 *     name?: string;
 *     connection?: Connection;
 * }} data
 */
export function setCurrentDb(data: {
    name?: string;
    connection?: Connection;
}): void {
    if (data.name) (global as any).db.name = data.name;
    if (data.connection) (global as any).db.connection = data.connection;
}

/**
 * 设置当前连接及当前连接的名称
 *
 * @export
 * @param {('name' | 'connection')} [type]
 * @returns
 */
export function getCurrentDb(type?: 'name' | 'connection') {
    const { db: cdb } = global as any;
    if (!type) return cdb;
    return type === 'name' ? cdb.name : cdb.connection;
}

/**
 * 关闭外键检测,防止数据注入出错
 *
 * @export
 * @param {Connection} connection
 * @param {boolean} [enabled=true]
 * @returns {Promise<Connection>}
 */
export async function resetForeignKey(
    connection: Connection,
    enabled = true,
): Promise<Connection> {
    const { type } = connection.driver.options;
    let key: string;
    let query: string;
    if (type === 'sqlite') {
        key = enabled ? 'OFF' : 'ON';
        query = `PRAGMA foreign_keys = ${key};`;
    } else {
        key = enabled ? '0' : '1';
        query = `SET FOREIGN_KEY_CHECKS = ${key};`;
    }
    await connection.query(query);
    return connection;
}
