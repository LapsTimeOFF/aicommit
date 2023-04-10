#! /usr/bin/env node
/* eslint-disable indent */
import { Option, program } from 'commander';
import { createSpinner } from 'nanospinner';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const inquirer = require('inquirer');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import packageJSON from '../package.json';
import {
  IConfig,
  getConfig,
  homedir,
  resetConfig,
  restoreConfig,
  setConfig,
} from './config';
import { commit, getDiff, getStagedFiles } from './git';

program
  .name(packageJSON.name)
  .description(packageJSON.description)
  .version(packageJSON.version);

program
  .name('commit')
  .option('-v, --verbose')
  .action(async ({ verbose }) => {
    if (process.argv.map((arg) => arg.includes('src/main.ts')).includes(true))
      verbose = true;

    if (verbose) console.log('[Verbose] Enabled ✅');
    if (verbose) console.log(getStagedFiles());

    const config = getConfig();
    if (verbose) console.log(config);
    if (config === false)
      return console.log(
        '⚠️ No config file were found, so a new file got created.'
      );

    const diff = getDiff();
    if (diff === '') return console.log('⚠️ No changes to commit.');

    const demoDiff = [
      'diff --git a/src/main.ts b/src/main.ts',
      'index bf5371f..3dfc75d 100644',
      '--- a/src/main.ts',
      '+++ b/src/main.ts',
      '@@ -43,6 +43,9 @@ program',
      '     const diff = getDiff();',
      '     if (diff === \'\') return console.log(\'⚠️ No changes to commit.\');',
      '',
      '+    const demoDiff = `diff --git a/src/main.ts b/src/main.ts',
      '+',
      '     const body = {',
      '       model: { id: \'gpt-3.5-turbo\', name: \'Default (GPT-3.5)\' },',
      '       messages: [',
      '@@ -54,6 +57,22 @@ program',
      '             config.scope === true ? \'(scope)\' : \'\'',
      '           }: description"\n${diff}`,',
      '         },',
      '+        {',
      '+          role: \'assistent\',',
      '+          content: `From the result of this "git diff" command, generate a commit message with the following format, if you want to use \'"\' use single quote instead "${',
      '+            config.emoji === true ? \'emoji\' : \'\'',
      '+          } type${',
      '+            config.scope === true ? \'(scope)\' : \'\'',
      '+          }: description"\n${diff}`,',
      '+        },',
      '+        {',
      '+          role: \'user\',',
      '+          content: `From the result of this "git diff" command, generate a commit message with the following format, if you want to use \'"\' use single quote instead "${',
      '+            config.emoji === true ? \'emoji\' : \'\'',
      '+          } type${',
      '+            config.scope === true ? \'(scope)\' : \'\'',
      '+          }: description"\n${diff}`,',
      '+        },',
      '       ],',
      '       key: \'\',',
      '       prompt: \'You are a helpful assistant\',',
    ].join('\n');

    const body = {
      model: { id: 'gpt-3.5-turbo', name: 'Default (GPT-3.5)' },
      messages: [
        {
          role: 'user',
          content: `From the result of this "git diff" command, generate a commit message with the following format, if you want to use '"' use single quote instead also, return only the commit message, NOTHING ELSE. And be precise in what has been changed "${
            config.emoji === true ? 'emoji' : ''
          } type${
            config.scope === true ? '(scope)' : ''
          }: description"\n${demoDiff}`,
        },
        {
          role: 'assistant',
          content: `${config.emoji === true ? '🎉' : ''} feat${config.scope === true ? '(main)' : ''}: Adding prompt to train GPT-3.5`,
        },
        {
          role: 'user',
          content: `Do the same thing for this git diff, ${config.emoji === true ? 'For the emojis, use the following rule: type->emoji; feat->✨; fix->🐛; docs->📚; style->💎; refactor->📦; perf->🚀; test->🚨; build->🛠️; ci->⚙️; chore->♻️; revert->🗑️;' : ''}:\n${diff}`,
        },
      ],
      key: '',
      prompt: 'You are a helpful assistant',
    };

    if (verbose) console.log(body.messages[2].content);
    const spinner = createSpinner('Generating commit message...').start();

    const response = await axios({
      method: 'post',
      url: 'https://www.t3nsor.tech/api/chat',
      headers: { 'Content-Type': 'application/json' },
      data: body,
    });
    const commitmsg = response.data;

    spinner.success();
    console.log(commitmsg);

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'commit',
        message: 'Do you want to commit with this message?',
        default: true,
      },
    ]);

    if (answers.commit === true) {
      const spinner = createSpinner('Committing...').start();
      const commitCmd = commit(commitmsg);
      spinner.success({
        text: 'Committed!',
      });
      console.log(commitCmd);
    }
  });

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
    new Option('-r, --reset', 'Reset the configuration file to default')
      .conflicts('get')
      .conflicts('set')
  )
  .addOption(
    new Option(
      '-R, --restore <path>',
      'Restore the configuration file from a backup'
    )
      .conflicts('get')
      .conflicts('set')
      .conflicts('reset')
  )
  .action(
    async ({
      get,
      set,
      verbose,
      reset,
      restore,
    }: {
      get?: keyof IConfig;
      set?: string;
      verbose?: boolean;
      reset?: boolean;
      restore?: string;
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
          case 'scope':
          case 'emoji':
            setConfig(key, value === 'true');
            break;
        }
      }
      if (reset === true) {
        console.log('🔥 Resetting configuration file...');
        resetConfig();
        console.log(
          `😎 KABOOM, config is GONE... (but a new one got created, also we backed up the old one at ${homedir}/.aicommit.old)`
        );
      }
      if (restore !== undefined) {
        console.log(`🔥 Restoring configuration file from ${restore}...`);
        restoreConfig(restore);
        console.log('😎 KABOOM, config is RESTORED...');
      }
    }
  );

program.parse();
