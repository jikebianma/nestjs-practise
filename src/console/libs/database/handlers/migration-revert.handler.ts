import { getCurrentDb } from '@/core';
import chalk from 'chalk';
import ora from 'ora';
import { execShell } from '../../common';
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
            chalk.greenBright.underline('👍 Revert migration successed'),
        );
    } catch (err) {
        console.log(chalk.red(err));
        spinner.fail(chalk.red('\n❌ Revert migration failed!'));
    }
    process.exit(0);
};
