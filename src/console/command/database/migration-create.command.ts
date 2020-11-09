import {
    MigrationCreateArguments,
    MigrationCreateHandler,
} from '@/console/libs';
import yargs from 'yargs';

export const command = ['db:migration:create', 'db:mc'];
export const describe = 'Creates a new migration file';
export const builder = {
    connection: {
        type: 'string',
        alias: 'c',
        describe: 'Connection name of typeorm to connect database.',
    },
    name: {
        type: 'string',
        alias: 'n',
        describe: 'Name of the migration class.',
        demandOption: true,
    },
    dir: {
        type: 'string',
        alias: 'd',
        describe: 'Directory where migration should be created.',
    },
    config: {
        type: 'string',
        alias: 'f',
        describe: 'Name of the file with connection configuration.',
    },
} as const;

export const handler = async (
    args: yargs.Arguments<MigrationCreateArguments>,
) => await MigrationCreateHandler(args);
