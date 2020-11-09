import { databasePath, dbOption, defaultDbName } from '@/core';
import chalk from 'chalk';
import ora from 'ora';
import { matchGlobs, panic, requireDefault, requirePaths } from '../../common';
import { runSeeder } from '../functions';
import { CLIDbOption, DbSeedArguments, SeederConstructor } from '../types';

async function seederRunner(spinner: ora.Ora, args: DbSeedArguments) {
    const cname = args.connection ?? defaultDbName();
    const options: CLIDbOption = dbOption<CLIDbOption>(cname);

    // 根据此连接的'factories'配置require所有的factory文件
    spinner.start('Including Factories');
    const factoryFiles = matchGlobs(
        options!.factories || [databasePath('factories/**/*.factory{.js,.ts}')],
        {},
        true,
    );

    try {
        requirePaths(factoryFiles);
        spinner.succeed('Factories are included');
    } catch (error) {
        panic(spinner, 'Could not include factories!', error);
    }

    // 根据此连接的'seeds'配置加载所有的seeder文件并遍历过滤
    // 如果命令行指定class选项则只获取指定seeder,没有则使用默认的DatabaseSeeder类
    spinner.start('Including Seeders');
    const seedFiles = matchGlobs(
        options!.seeds || [databasePath('seeder/**/*.seed{.js,.ts}')],
        {},
        true,
    );
    let seeders: SeederConstructor[] = [];
    let currentSeeder: SeederConstructor | undefined;
    try {
        seeders = seedFiles.map((seedFile) =>
            requireDefault<SeederConstructor>(seedFile),
        );
        currentSeeder = seeders.find((item) =>
            args.seeder === undefined
                ? item.name === 'DatabaseSeeder'
                : item.name === args.seeder,
        );
        if (!currentSeeder) {
            panic(
                spinner,
                `seeder class which namaed ${args.seeder} or DatabaseSeeder not exists`,
                new Error('seeder not found'),
            );
        }
        spinner.succeed('Seeders are included');
        // 运行seeder
        spinner.start(`Executing ${currentSeeder!.name} Seeder`);
        try {
            await runSeeder(
                currentSeeder!,
                seeders.filter((item) => item.name !== currentSeeder!.name),
                args,
                spinner,
            );
            spinner.succeed(`Seeder ${currentSeeder!.name} executed`);
        } catch (error) {
            panic(
                spinner,
                `Could not run the seed ${currentSeeder!.name}!`,
                error,
            );
        }
    } catch (error) {
        panic(spinner, 'Could not include seeders!', error);
    }
}

export const SeedHandler = async (args: DbSeedArguments) => {
    // tslint:disable-next-line
    const { log } = console;
    const spinner = ora('Start run seeder').start();
    await seederRunner(spinner, args);
    log('\n', '👍 ', chalk.greenBright.underline(`Finished Seeding`));
    process.exit(0);
};
