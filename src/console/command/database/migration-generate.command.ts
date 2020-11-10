import {
    MigrationGenerateArguments,
    MigrationGenerateHandler,
} from '@/console/libs';
import yargs from 'yargs';

export const command = ['db:migration:generate', 'db:mg'];
export const describe =
    'Generates a new migration file with sql needs to be executed to update schema.';
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
    pretty: {
        type: 'boolean',
        alias: 'p',
        describe: 'Pretty-print generated SQL',
        default: false,
    },
    config: {
        type: 'string',
        alias: 'f',
        describe: 'Name of the file with connection configuration.',
    },
} as const;

export const handler = async (
    args: yargs.Arguments<MigrationGenerateArguments>,
) => await MigrationGenerateHandler(args);
