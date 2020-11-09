import { getCurrentDb } from '@/core';
import chalk from 'chalk';
import ora from 'ora';
import { execShell } from '../../common';
import { MigrationGenerateArguments } from '../types';
import { getTypeorm } from './typeorm';

export const MigrationGenerateHandler = async (
    args: MigrationGenerateArguments,
) => {
    const typeCommand = await getTypeorm(args);
    let command = `${typeCommand} migration:generate -n ${
        args.name
    } -c ${getCurrentDb('name')}`;
    if (args.dir) command = `${command} -d ${args.dir}`;
    if (args.pretty) command = `${command} -p`;
    const spinner = ora('Start to revert migration').start();
    try {
        await execShell(command, args.pretty);
        spinner.succeed(
            chalk.greenBright.underline('👍 Finished generate migration'),
        );
    } catch (err) {
        console.log(chalk.red(err));
        spinner.fail(chalk.red('\n❌ Generate migration failed!'));
        process.exit(0);
    }
};
