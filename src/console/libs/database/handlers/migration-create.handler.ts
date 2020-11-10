import { getCurrentDb } from '@/core';
import chalk from 'chalk';
import ora from 'ora';
import { execShell, panic } from '../../common';
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
    const spinner = ora('Start to create migration').start();
    try {
        await execShell(command);
        spinner.succeed(
            chalk.greenBright.underline('\n 👍 Finished create migration'),
        );
    } catch (err) {
        panic(spinner, 'Create migration failed!', err);
    }
    process.exit(0);
};
