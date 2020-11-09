import { resetForeignKey } from '@/core';
import ora from 'ora';
import { Connection, EntityManager } from 'typeorm';
import { panic } from '../common';
import { factory as dataFactory } from './functions';
import {
    DataFactory,
    DbSeedArguments,
    Seeder,
    SeederConstructor,
} from './types';

export abstract class BaseSeeder implements Seeder {
    protected connection!: Connection;

    protected em!: EntityManager;

    protected truncates: Function[] | Array<new (...args: any[]) => any> = [];

    constructor(
        protected readonly seeders: SeederConstructor[],
        protected readonly spinner: ora.Ora,
        protected readonly args: DbSeedArguments,
    ) {}

    public async load(
        factory: DataFactory,
        connection: Connection,
    ): Promise<any> {
        this.connection = await resetForeignKey(connection);

        this.em = this.connection.createEntityManager();
        for (const truncate of this.truncates) {
            await this.em.clear(truncate);
        }
        this.connection = await resetForeignKey(connection, false);
        const result = await this.run(factory, this.connection);
        return result;
    }

    /**
     * 运行seeder的关键方法
     *
     * @param factory
     * @param connection
     */
    protected abstract async run(
        factory: DataFactory,
        connection: Connection,
    ): Promise<any>;

    /**
     * 运行子seeder
     *
     * @param SubSeeder
     */
    protected async call(SubSeeder: SeederConstructor) {
        if (
            !this.seeders
                .map((item) => item.name)
                .find((name) => name === SubSeeder.name)
        ) {
            panic(
                this.spinner,
                `seeder class which namaed ${SubSeeder.constructor.name} or DatabaseSeeder not exists`,
                new Error('seeder not found'),
            );
        }
        const subSeeder: Seeder = new SubSeeder(
            this.seeders,
            this.spinner,
            this.args,
        );
        await subSeeder.load(dataFactory, this.connection);
    }
}
