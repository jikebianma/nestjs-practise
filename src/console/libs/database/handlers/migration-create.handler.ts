import { getCurrentDb } from '@/core';
import chalk from 'chalk';
import ora from 'ora';
import { execShell } from '../../common';
import { MigrationCreateArguments } from '../types';
import { getTypeorm } from './typeorm';

export const MigrationCreateHandler = async (
    args: MigrationCreateArguments,
) => {
    const typeCommand = await getTypeorm(args);
    let command = `${typeCommand} migration:create -n ${
        args.name
    } -c ${getCurrentDb('name')}`;
    if (args.dir) command = `${command} -d ${args.dir}`;
    const spinner = ora('Start to revert migration').start();
    try {
        await execShell(command);
        spinner.succeed(
            chalk.greenBright.underline('👍 Finished create migration'),
        );
    } catch (err) {
        console.log(chalk.red(err));
        spinner.fail(chalk.red('\n❌ Create migration failed!'));
        process.exit(0);
    }
};
