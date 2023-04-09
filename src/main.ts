#! /usr/bin/env node
import { Option, program } from 'commander';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import packageJSON from '../package.json';
import { IConfig, getConfig } from './config';

program
  .name(packageJSON.name)
  .description(packageJSON.description)
  .version(packageJSON.version);

program
  .command('config')
  .description('Manage configuration')
  .addOption(new Option('-g, --get <key>', 'Get a configuration value'))
  .addOption(new Option('-v, --verbose', 'Add more output'))
  .addOption(
    new Option(
      '-s, --set <key>=<value>',
      'Set a configuration value'
    ).conflicts('get')
  )
  .action(
    async ({
      get,
      set,
      verbose,
    }: {
      get?: keyof IConfig;
      set?: string;
      verbose?: boolean;
    }) => {
      // Force verbose if the command the developer is running is the main.ts file
      if (process.argv.map((arg) => arg.includes('src/main.ts')).includes(true))
        verbose = true;

      if (verbose) console.log('[Verbose] Enabled ✅');
      if (verbose) console.log({ get, set, verbose });
      if (get !== undefined) {
        const config = getConfig();
        if (config === false)
          return console.log('⚠️ No config file were found, so a new file got created.');
        
        if (verbose) console.log(config);

        console.log(config[get] ?? '⚠️ No value found for this key.');
      }
    }
  );

program.parse();
