import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { SelectQueryBuilder } from 'typeorm';
/** ****************************************** Time Util **************************************** */
/**
 * 时间生成器参数接口
 */
export interface TimeOptions {
    date?: dayjs.ConfigType;
    format?: dayjs.OptionType;
    locale?: string;
    strict?: boolean;
    zonetime?: string;
}

/** ****************************************** Dabase Util **************************************** */

/**
 * 数据库连接配置
 */
export type DbOption = TypeOrmModuleOptions & { [key: string]: any };

export type QueryHook<Entity> = (
    hookQuery: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>;
