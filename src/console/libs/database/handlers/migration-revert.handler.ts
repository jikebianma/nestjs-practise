import { getCurrentDb } from '@/core';
import chalk from 'chalk';
import ora from 'ora';
import { execShell, panic } from '../../common';
import { MigrationRevertArguments } from '../types';
import { getTypeorm } from './typeorm';

export const MigrationRevertHandler = async (
    args: MigrationRevertArguments,
    typeormCli?: string,
) => {
    const typeCommand = typeormCli ?? (await getTypeorm(args));
    let command = `${typeCommand} migration:revert -c ${getCurrentDb('name')}`;
    if (args.transaction) command = `${command} -t ${args.transaction}`;
    const spinner = ora('Start to revert migration').start();
    try {
        await execShell(command, args.pretty);
        spinner.succeed(
            chalk.greenBright.underline('\n 👍 Revert migration successed'),
        );
    } catch (err) {
        panic(spinner, 'Revert migration failed!', err);
    }
    process.exit(0);
};
