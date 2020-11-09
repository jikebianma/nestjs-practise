import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import merge from 'deepmerge';
import { DatabaseConfig, DbOption } from '../interface';
import { BaseUtil, IConfigMaps } from './base';

/**
 * 数据库工具类
 *
 * @export
 * @class DatabaseUtil
 */
export class Database extends BaseUtil<DbOption[]> {
    static subscribers: any[] = [];

    // protected subscribers: Function[] = [];

    protected configMaps: IConfigMaps = {
        required: true,
        maps: 'database',
    };

    protected _default!: string;

    protected _names: string[] = [];

    /**
     * 获取默认数据库配置名称
     *
     * @returns
     * @memberof Database
     */
    get default() {
        return this._default;
    }

    /**
     * 获取所有数据库配置名
     *
     * @returns
     * @memberof Database
     */
    get names() {
        return this._names;
    }

    /**
     * 获取所有连接配置
     *
     * @template T
     * @returns {T[]}
     * @memberof Database
     */
    getOptions<T extends DbOption = DbOption>(): T[] {
        return this.config as T[];
    }

    /**
     * 根据名称获取一个数据库连接的配置，可设置类型
     * name不设置的情况下返回默认连接的配置
     *
     * @template T
     * @param {string} [name]
     * @returns {T}
     * @memberof Database
     */
    getOption<T extends DbOption = DbOption>(name?: string): T {
        const findName: string | undefined = name ?? this._default;
        const option = this.getOptions().find((item) => item.name === findName);
        if (!option) {
            throw new Error(
                `Connection named ${findName}'s option not exists!`,
            );
        }
        return option as T;
    }

    /**
     * 获取用于TypeOrmModule的数据库连接的配置
     * 设置autoLoadEntities为true,使entity在autoLoadEntities后自动加载
     * 由于entity在autoLoadEntities后自动加载,subscriber由提供者方式注册
     * 所以在配置中去除这两者
     *
     * @returns
     * @memberof Database
     */
    getNestOptions() {
        return this.config.map((option) => {
            const all = {
                ...option,
                autoLoadEntities: true,
            };
            const { entities, subscribers, ...nestOption } = all;
            if (option.name === this._default) {
                const { name, ...nameNone } = nestOption;
                return nameNone;
            }
            return nestOption;
        }) as DbOption[];
    }

    /**
     * 根据名称获取一个用于TypeOrmModule的数据库连接的配置
     * 没有名称则获取默认配置
     *
     * @param {string} [name]
     * @returns
     * @memberof Database
     */
    getNestOption(name?: string) {
        const option = this.getNestOptions().find((item) => item.name === name);
        if (!option) {
            throw new Error(`Connection named ${name}'s option not exists!`);
        }
        return option;
    }

    /**
     * 为Nestjs框架的Tyeporm模块提供数据库连接构造器
     *
     * @returns {DynamicModule[]}
     * @memberof DatabaseUtil
     */
    register(): DynamicModule[] {
        return this.getNestOptions().map((connection) =>
            TypeOrmModule.forRoot(connection),
        );
    }

    create(config: DatabaseConfig) {
        // 如果没有配置默认数据库则抛出异常
        if (!config.default) {
            throw new Error('default connection name should been config!');
        }
        // 只把启用的数据库配置写入this.config
        // 数据库配置名必须填写,没有数据库配置名的直接略过
        this.config = config.connections
            .filter((connect) => {
                if (!connect.name) return false;
                if (config.default === connect.name) return true;
                return config.enabled.includes(connect.name);
            })
            .map((connect) => merge(config.common, connect) as DbOption);
        // 把启用的数据库配置名写入this.names
        this.config.forEach((connect) => this._names.push(connect.name!));
        this._default = config.default;
        // 如果启用的数据库配置名中不包含默认配置名则抛出异常
        if (!this._names.includes(this._default)) {
            throw new Error(
                `Default connection named ${this._default} not exists!`,
            );
        }
    }
}
