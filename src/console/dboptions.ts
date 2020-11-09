import * as configs from '@/config';
import { Database, Gkr, setCurrentDb } from '@/core';
import yargs from 'yargs';

Gkr.init(configs).util.add(Database);
const cname = yargs.argv.connection;
if (cname) setCurrentDb({ name: cname as string });
const options = Gkr.util.get(Database).getOptions();
export = options;
