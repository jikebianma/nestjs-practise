import {
    MigrationRefreshArguments,
    MigrationRefreshHandler,
} from '@/console/libs';
import yargs from 'yargs';

export const command = ['db:migration:refresh', 'db:mrf'];
export const describe = 'Refresh migrations';
export const builder = {
    connection: {
        type: 'string',
        alias: 'c',
        describe: 'Name of the connection on which run a query.',
    },
    transaction: {
        type: 'string',
        alias: 't',
        describe:
            ' Indicates if transaction should be used or not formigration revert. Enabled by default.',
        default: 'default',
    },
    config: {
        type: 'string',
        alias: 'f',
        describe: 'Name of the file with connection configuration.',
    },
    pretty: {
        type: 'boolean',
        alias: 'p',
        describe: 'Pretty-print generated SQL',
        default: false,
    },
    seed: {
        type: 'boolean',
        alias: 's',
        describe: 'Run seed for database.',
    },
    seeder: {
        type: 'string',
        alias: 'sd',
        describe: 'Specific seeder class name to run.',
    },
} as const;

export const handler = async (
    args: yargs.Arguments<MigrationRefreshArguments>,
) => await MigrationRefreshHandler(args);
