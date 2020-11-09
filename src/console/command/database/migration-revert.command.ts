import { MigrationRevertHandler, MigrationRunArguments } from '@/console/libs';
import yargs from 'yargs';

export const command = ['db:migration:resvert', 'db:mrt'];
export const describe = 'Reverts last executed migration';
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
} as const;

export const handler = async (args: yargs.Arguments<MigrationRunArguments>) =>
    await MigrationRevertHandler(args);
