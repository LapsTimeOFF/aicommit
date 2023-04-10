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
import { commit, getDiff, getStagedFiles, push } from './git';

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

    const body = {
      model: { id: 'gpt-3.5-turbo', name: 'Default (GPT-3.5)' },
      messages: [
        {
          role: 'system',
          content: `You are to act as the author of a commit message in git. Your mission is to create clean and comprehensive commit messages in the conventional commit convention and explain why a change was done. I'll send you an output of 'git diff --staged' command, and you convert it into a commit message.
          ${
            config?.emoji === true
              ? 'Use GitMoji convention to preface the commit.'
              : 'Do not preface the commit with anything.'
          }
          ${
            config?.scope === true
              ? 'Use a scope (example: "type(scope): msg").'
              : 'Do not preface the commit with anything.'
          }
          ${
            config?.description === true
              ? 'Add a short description of WHY the changes are done after the commit message. Don\'t start it with "This commit", just describe the changes.'
              : 'Don\'t add any descriptions to the commit, only commit message.'
          }
          Use the present tense. Lines must not be longer than 74 characters.`,
        },
        {
          role: 'user',
          content: `diff --git a/src/server.ts b/src/server.ts
          index ad4db42..f3b18a9 100644
          --- a/src/server.ts
          +++ b/src/server.ts
          @@ -10,7 +10,7 @@
          import {
            initWinstonLogger();
            
            const app = express();
           -const port = 7799;
           +const PORT = 7799;
            
            app.use(express.json());
            
          @@ -34,6 +34,6 @@
          app.use((_, res, next) => {
            // ROUTES
            app.use(PROTECTED_ROUTER_URL, protectedRouter);
            
           -app.listen(port, () => {
           -  console.log(\`Server listening on port \${port}\`);
           +app.listen(process.env.PORT || PORT, () => {
           +  console.log(\`Server listening on port \${PORT}\`);
            });`,
        },
        {
          role: 'assistant',
          content: `${
  config?.emoji === true ? '🐛 ' : ''
}fix(server.ts): change port variable case from lowercase port to uppercase PORT
${
  config?.emoji  === true? '✨ ' : ''
}feat(server.ts): add support for process.env.PORT environment variable
${
  config?.description === true
    ? 'The port variable is now named PORT, which improves consistency with the naming conventions as PORT is a constant. Support for an environment variable allows the application to be more flexible as it can now run on any available port specified via the process.env.PORT environment variable.'
    : ''
}`,
        },
        {
          role: 'user',
          content: diff,
        },
      ],
      key: '',
      prompt: 'You are a helpful assistant',
    };

    if (verbose) console.log(body.messages[3].content);
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
      if (config.autoPush === true) {
        const spinner = createSpinner('Pushing...').start();
        const pushCmd = push();
        spinner.success({
          text: 'Pushed!',
        });
        console.log(pushCmd);
      } else
        console.log(
          '⚠️ Auto push is disabled, so you have to push manually. You can enable it by running "aiconfig config -s autoPush=true"'
        );
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
          case 'autoPush':
          case 'description':
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
