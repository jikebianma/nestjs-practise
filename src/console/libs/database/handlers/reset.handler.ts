import { defaultDbName, getCurrentDb } from '@/core';
import chalk from 'chalk';
import ora from 'ora';
import { panic } from '../../common';
import { makeCurrentDb } from '../functions';
import { DbRefreshArguments } from '../types';
import { SeedHandler } from './seed.handler';

export const ResetHandler = async (args: DbRefreshArguments) => {
    const { log } = console;
    const spinner = ora('Start connect to database').start();
    const cname = args.connection ?? defaultDbName();
    await makeCurrentDb(cname, spinner);

    const connection = getCurrentDb('connection');
    try {
        spinner.start('Start sync entity to database');
        await connection.dropDatabase();
        if (args.destory) {
            await connection.close();
            log(
                '\n',
                '\n 👍 ',
                chalk.greenBright.underline('Finished destory the database'),
            );
            process.exit(0);
        }
        await connection.synchronize();
        await connection.close();
        spinner.succeed(
            chalk.greenBright.underline('\n 👍 inished reset database'),
        );
    } catch (error) {
        panic(spinner, 'Database sync failed', error);
    }
    if (args.seed) {
        await SeedHandler(args);
    }
    process.exit(0);
};
