import { DbOption } from '@/core';
import Faker from 'faker';
import ora from 'ora';
import { Connection, ObjectType } from 'typeorm';
import { EntityFactory } from './factory';
/**
 * 增加的CLI的数据库连接配置
 */
export type CLIDbOption = DbOption & {
    factories?: string[];
    seeds?: string[];
};

/**
 * CLI命令参数
 */
export interface DbRefreshArguments {
    connection?: string;
    seed?: string;
    destory?: boolean;
}
export interface DbSeedArguments {
    connection?: string;
    seeder?: string;
}

export interface TypeOrmArguments {
    connection?: string;
    config?: string;
}

export interface MigrationCreateArguments extends TypeOrmArguments {
    name: string;
    dir?: string;
}

export interface MigrationGenerateArguments extends TypeOrmArguments {
    name: string;
    dir?: string;
    pretty?: boolean;
}

export interface MigrationRunArguments extends TypeOrmArguments {
    transaction?: string;
    pretty?: boolean;
    seed?: string;
    seeder?: string;
}

export interface MigrationRevertArguments extends TypeOrmArguments {
    transaction?: string;
    pretty?: boolean;
}

export interface MigrationRefreshArguments extends TypeOrmArguments {
    transaction?: string;
    pretty?: boolean;
    seed?: string;
    seeder?: string;
    force?: boolean;
}

/**
 * Seeder类接口
 */
export interface Seeder {
    load: (factory: DataFactory, connection: Connection) => Promise<void>;
}

/**
 * Seeder类构造器接口
 */
export type SeederConstructor = new (
    seeders: SeederConstructor[],
    spinner: ora.Ora,
    args: DbSeedArguments,
) => Seeder;

/**
 * factory函数的接口
 */
export interface EntityFactoryDefinition<Entity, Options> {
    entity: ObjectType<Entity>;
    factory: DataFactoryFunction<Entity, Options>;
}

/**
 * factory回调函数接口
 */
export type DataFactoryFunction<Entity, Options> = (
    faker: typeof Faker,
    options?: Options,
) => Promise<Entity>;

export type EntityProperty<Entity> = {
    [Property in keyof Entity]?: Entity[Property];
};

/**
 *  获取entity映射的factory的函数接口
 */
export type DataFactory = <Entity>(
    entity: ObjectType<Entity>,
) => <Options>(options?: Options) => EntityFactory<Entity, Options>;
