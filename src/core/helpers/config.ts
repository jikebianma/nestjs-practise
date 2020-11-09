import { EnviromentType } from '../constants';
import { BaseConfig } from '../interface';
import { configure } from '../utils/configure';
import { env } from '../utils/env';

/**
 * 获取当前运行环境
 *
 * @export
 * @returns {string}
 */
export function environment(): EnviromentType {
    return env<EnviromentType>('NODE_ENV', EnviromentType.DEV);
}

export function config<T extends BaseConfig = BaseConfig>(): T;
export function config<T = any>(key: string, defaultValue?: T): T;
/**
 * 获取或设置配置
 *
 */
export function config<T = any>(key?: string, defaultValue?: T) {
    if (typeof key === 'string') {
        return configure.get<T>(key, defaultValue);
    }
    return configure.all();
}
