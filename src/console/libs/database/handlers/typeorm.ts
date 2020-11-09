import { defaultDbName } from '@/core';
import findUp from 'find-up';
import ora from 'ora';
import shell from 'shelljs';
import { matchGlobs, panic } from '../../common';
import { makeCurrentDb } from '../functions';
import { TypeOrmArguments } from '../types';

export const getTypeorm = async (args: TypeOrmArguments) => {
    const spinner = ora('Loading database config').start();
    const configs =
        args.config ??
        matchGlobs(['**/dboptions.{ts,js}'], {
            ignore: '**/node_modules/**',
        });
    if (configs.length === 0) {
        panic(spinner, `Config File not found!`);
    }
    const configFile = configs[0];
    const crossEnv = shell.which('cross-env');
    if (!crossEnv) {
        panic(
            spinner,
            `Considering multi-platform compatibility,cross-env must be install!`,
        );
    }
    const tsNode = shell.which('ts-node');
    if (!tsNode) {
        panic(spinner, `ts-node is not be installed,please install it first!`);
    }
    const typeormCli = findUp.sync(['node_modules/typeorm/cli.js']);
    if (!typeormCli) {
        panic(spinner, `typeorm is not be installed,please install it first!`);
    }
    const name = args.connection ?? defaultDbName();
    await makeCurrentDb(name, spinner);
    return `${crossEnv} NODE_ENV=development ${tsNode} -r tsconfig-paths/register  -T --files ${typeormCli} --config ${configFile}`;
};
