#!/usr/bin/env NODE_ENV=development node
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable global-require */
import * as configs from '@/config';
import { Database, Gkr } from '@/core';
import ora from 'ora';
import yargs from 'yargs';
import {
    DbRest,
    DbSeed,
    MigrationCreateCommand,
    MigrationGenerateCommand,
    MigrationRefreshCommand,
    MigrationRevertCommand,
    MigrationRunCommand,
} from './command';
import { panic } from './libs';

const spinner = ora('Startup the framework..').start();

try {
    Gkr.init(configs).util.add(Database);
    spinner.succeed('Framework been started');
} catch (error) {
    panic(spinner, 'Startup framework failed.', error);
}
yargs
    .usage('Usage: $0 <command> [options]')
    .command(DbRest)
    .command(DbSeed)
    .command(MigrationCreateCommand)
    .command(MigrationGenerateCommand)
    .command(MigrationRunCommand)
    .command(MigrationRevertCommand)
    .command(MigrationRefreshCommand)
    .demandCommand(1)
    .strict()
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help').argv;
