import { getCurrentDb } from '@/core';
import chalk from 'chalk';
import ora from 'ora';
import { execShell, panic } from '../../common';
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
    const spinner = ora('Start to generate migration').start();
    try {
        if (args.force) {
            try {
                ora('Start to destory db').start();
                await getCurrentDb('connection').dropDatabase();
            } catch (err) {
                panic(spinner, 'Destory db failed!', err);
            }
        }
        await execShell(command, args.pretty);
        spinner.succeed(
            chalk.greenBright.underline('👍 Finished generate migration'),
        );
    } catch (err) {
        panic(spinner, 'Generate migration failed!', err);
    }
    process.exit(0);
};
