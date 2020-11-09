/** ****************************************** 配置类接口 **************************************** */

import { DbOption } from './utils';

// 配置注册函数
export type ConfigRegister<T> = () => T;
// 多个配置集合对象
export type ConfigRegCollection<T> = {
    [P in keyof T]?: () => T[P];
};
// 基础配置
export interface BaseConfig {
    app: AppConfig;
    [key: string]: any;
}

/** ****************************************** APP配置 **************************************** */
export interface AppConfig {
    debug: boolean;
    timezone: string;
    locale: string;
    port: number;
    https: boolean;
    host: string;
    hash: number;
    url?: string;
}

/** ****************************************** 数据库配置 **************************************** */

export interface DatabaseConfig<T extends DbOption = DbOption> {
    default: string;
    enabled: string[];
    connections: T[];
    common: { [key: string]: any };
}
