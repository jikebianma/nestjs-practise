/* eslint-disable no-return-assign */
import { entityName, getCurrentDb, makeConnection, setCurrentDb } from '@/core';
import chalk from 'chalk';
import ora from 'ora';
import { ObjectType } from 'typeorm';
import { panic } from '../common';
import { EntityFactory } from './factory';
import {
    DataFactory,
    DataFactoryFunction,
    DbSeedArguments,
    EntityFactoryDefinition,
    Seeder,
    SeederConstructor,
} from './types';

// -------------------------------------------------------------------------
// 全局变量用于存储factories文件
// -------------------------------------------------------------------------
(global as any).dbFactories = new Map<
    string,
    EntityFactoryDefinition<any, any>
>();

/**
 * 创建当前全局连接
 *
 * @export
 * @param {string} name
 * @param {ora.Ora} [spinner]
 */
export async function makeCurrentDb(name: string, spinner?: ora.Ora) {
    try {
        const successed = 'Database connected';
        setCurrentDb({ name });
        const connection = await makeConnection(name);
        setCurrentDb({ connection });
        spinner
            ? spinner.succeed(successed)
            : console.log(chalk.green(successed));
    } catch (error) {
        const failed = `Database connection failed! Connection which named ${name} can not be connect`;
        spinner
            ? panic(spinner, failed, error)
            : console.log(chalk.red(failed));
        process.exit(0);
    }
}

/**
 * 定义factory,绑定Entiy类名
 * factoryFn自动注入faker.js对象
 *
 * @export
 * @template Entity
 * @template Settings
 * @param {ObjectType<Entity>} entity
 * @param {DataFactoryFunction<Entity, Settings>} factoryFn
 */
export function defineFactory<Entity, Settings>(
    entity: ObjectType<Entity>,
    factoryFn: DataFactoryFunction<Entity, Settings>,
) {
    (global as any).dbFactories.set(entityName(entity), {
        entity,
        factory: factoryFn,
    });
}

/**
 * factory函数,使用高阶包装
 * ObjectType通过new (): T用于从类生成接口类型
 *
 * @param entity
 */
export const factory: DataFactory = (entity) => (settings) => {
    const name = entityName(entity);
    const entityFactoryObject = (global as any).dbFactories.get(name);
    return new EntityFactory(
        name,
        entity,
        entityFactoryObject.factory,
        settings,
    );
};

/**
 * 运行seeder
 *
 * @param Clazz
 */
export async function runSeeder(
    Clazz: SeederConstructor,
    seeders: SeederConstructor[],
    args: DbSeedArguments,
    spinner: ora.Ora,
): Promise<void> {
    const seeder: Seeder = new Clazz(seeders, spinner, args);
    // 运行seed er的'run'方法并注入factory和当前连接
    return await seeder.load(factory, getCurrentDb('connection'));
}
