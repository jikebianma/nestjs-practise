import { getCurrentDb } from '@/core';
import chalk from 'chalk';
import ora from 'ora';
import { execShell, panic } from '../../common';
import { MigrationRunArguments } from '../types';
import { SeedHandler } from './seed.handler';
import { getTypeorm } from './typeorm';

export const MigrationRunHandler = async (
    args: MigrationRunArguments,
    typeormCli?: string,
) => {
    const typeCommand = typeormCli ?? (await getTypeorm(args));
    const connection = getCurrentDb('connection');
    let command = `${typeCommand} migration:run -c ${getCurrentDb('name')}`;
    if (args.transaction) command = `${command} -t ${args.transaction}`;
    const spinner = ora('Start to run migration').start();
    try {
        await execShell(command, args.pretty);
        spinner.succeed(
            chalk.greenBright.underline('👍 Run migration successed'),
        );
    } catch (err) {
        panic(spinner, 'Run migration failed!', err);
    }
    if (args.seed) {
        await connection.close();
        await SeedHandler(args);
    }
    process.exit(0);
};
