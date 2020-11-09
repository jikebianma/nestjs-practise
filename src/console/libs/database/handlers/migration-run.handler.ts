import { getCurrentDb } from '@/core';
import chalk from 'chalk';
import ora from 'ora';
import { execShell } from '../../common';
import { MigrationRunArguments } from '../types';
import { SeedHandler } from './seed.handler';
import { getTypeorm } from './typeorm';

export const MigrationRunHandler = async (
    args: MigrationRunArguments,
    typeormCli?: string,
) => {
    const typeCommand = typeormCli ?? (await getTypeorm(args));
    let command = `${typeCommand} migration:run -c ${getCurrentDb('name')}`;
    if (args.transaction) command = `${command} -t ${args.transaction}`;
    const spinner = ora('Start to run migration').start();
    try {
        await execShell(command, args.pretty);
        spinner.succeed(
            chalk.greenBright.underline('👍 Run migration successed'),
        );
    } catch (err) {
        console.log(chalk.red(err));
        spinner.fail(chalk.red('\n❌ Run migration failed!'));
    }
    if (args.seed) {
        await SeedHandler(args);
    }
    process.exit(0);
};
