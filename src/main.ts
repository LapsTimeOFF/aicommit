#! /usr/bin/env node
/* eslint-disable indent */
import { Option, program } from 'commander';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import packageJSON from '../package.json';
import { IConfig, getConfig, resetConfig, setConfig } from './config';

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
  .addOption(
    new Option(
      '-r, --reset',
      'Reset the configuration file to default'
    ).conflicts('get').conflicts('set')
  )
  .action(
    async ({
      get,
      set,
      verbose,
      reset
    }: {
      get?: keyof IConfig;
      set?: string;
      verbose?: boolean;
      reset?: boolean;
    }) => {
      // Force verbose if the command the developer is running is the main.ts file
      if (process.argv.map((arg) => arg.includes('src/main.ts')).includes(true))
        verbose = true;

      if (verbose) console.log('[Verbose] Enabled ✅');
      if (verbose) console.log({ get, set, verbose });
      if (get !== undefined) {
        const config = getConfig();
        if (config === false)
          return console.log(
            '⚠️ No config file were found, so a new file got created.'
          );

        if (verbose) console.log(config);

        console.log(config[get] ?? '⚠️ No value found for this key.');
      }
      if (set !== undefined) {
        const [key, value] = set.split('=') as [keyof IConfig, string];
        if (verbose) console.log({ key, value });

        switch (key) {
          case 'emoji':
            setConfig(key, value === 'true');
            break;
        }
      }
      if(reset === true) {
        console.log('🔥 Resetting configuration file...');
        resetConfig();
      }
    }
  );

program.parse();
