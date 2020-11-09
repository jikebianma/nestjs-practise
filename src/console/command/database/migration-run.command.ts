import { MigrationRunArguments, MigrationRunHandler } from '@/console/libs';
import yargs from 'yargs';

export const command = ['db:migration:run', 'db:mrn'];
export const describe = 'Runs all pending migrations.';
export const builder = {
    connection: {
        type: 'string',
        alias: 'c',
        describe: 'Connection name of typeorm to connect database.',
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

export const handler = async (args: yargs.Arguments<MigrationRunArguments>) =>
    await MigrationRunHandler(args);
