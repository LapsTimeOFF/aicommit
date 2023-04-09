#! /usr/bin/env node
import { program } from 'commander';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import packageJSON from '../package.json';

program
  .name(packageJSON.name)
  .description(packageJSON.description)
  .version(packageJSON.version);

program
  .command('config')
  .description('Manage configuration')
  .option('-g, --get <key>', 'Get a configuration value')
  .option('-s, --set <key> <value>', 'Set a configuration value')
  .action(({get}) => console.log(get));

program.parse();