import { DbSeedArguments, SeedHandler } from '@/console/libs';
import * as yargs from 'yargs';

export const command = ['db:seed', 'db:s'];
export const describe = 'Runs the databased seeds';
export const builder = {
    connection: {
        type: 'string',
        alias: 'c',
        describe: 'Connection name of typeorm to connect database.',
    },
    seeder: {
        type: 'string',
        alias: 's',
        describe: 'Specific seeder class name to run.',
    },
} as const;

export const handler = async (args: yargs.Arguments<DbSeedArguments>) =>
    await SeedHandler(args);
