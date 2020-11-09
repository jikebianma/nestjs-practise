import { INestApplication } from '@nestjs/common';
import chalk from 'chalk';
import { BaseConfig, ConfigRegCollection } from './interface';
import { Hash, Time } from './utils';
import { Configure, configure } from './utils/configure';
import { UtilResolver } from './utils/resolver';

export type RunnerParams = {
    util: UtilResolver;
} & { configure: typeof configure } & { Configure: typeof Configure };
export type Runner = (params: RunnerParams) => Promise<INestApplication>;

export class Gkr {
    static util: UtilResolver = new UtilResolver();

    static init<T extends BaseConfig = BaseConfig>(
        configs: ConfigRegCollection<T>,
    ) {
        configure.create(configs);
        this.util.add(Hash, Time);
        return this;
    }

    static async run(runner: Runner) {
        const app = await runner({ util: this.util, configure, Configure });
        const host = configure.get<boolean>('app.host');
        const port = configure.get<number>('app.port')!;
        const https = configure.get<boolean>('app.https');
        let appUrl = configure.get<string>('app.url');
        if (!appUrl) {
            appUrl = `${https ? 'https' : 'http'}://${host!}:${port}`;
        }
        await app.listen(port, '0.0.0.0', () => {
            console.log();
            console.log('Server has started:');
            console.log(`- Address: ${chalk.green.underline(appUrl)}`);
        });
    }
}
