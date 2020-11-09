/** ************************ 注意: 此命令被丢弃,建议使用db:migration:refresh *********************************** */
import { DbRefreshArguments, ResetHandler } from '@/console/libs';
import * as yargs from 'yargs';

export const command = ['db:reset', 'db:r'];
export const describe = 'Delete all tables and run migrate';
export const builder = {
    connection: {
        type: 'string',
        alias: 'c',
        describe: 'Connection name of typeorm to connect database.',
    },
    destory: {
        type: 'boolean',
        alias: 'd',
        describe: 'Only delete all tables of database.',
    },
    seed: {
        type: 'boolean',
        alias: 's',
        describe: 'Run seed for database.',
    },
} as const;

export const handler = async (args: yargs.Arguments<DbRefreshArguments>) =>
    await ResetHandler(args);
