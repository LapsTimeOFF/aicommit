import fs from 'fs';
import os from 'os';
import path from 'path';

export interface IConfig {
  emoji?: boolean;
}

export const homedir = os.homedir();

export const getConfig = (): IConfig | false => {

  let config;

  try {
    config = JSON.parse(
      fs.readFileSync(path.join(homedir, '.aicommit')).toString()
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      config = false;
      fs.writeFileSync(path.join(homedir, '.aicommit'), JSON.stringify({}));
    } else {
      throw error;
    }
  }

  return config;
};

export const setConfig = <K extends keyof IConfig>(key: K, value: IConfig[K]): void => {
  const config = getConfig();

  if (config === false) 
    return console.log('No config file were found, so a new file got created.');

  config[key] = value;

  fs.writeFileSync(path.join(homedir, '.aicommit'), JSON.stringify(config));
};

export const resetConfig = (): void => {
  const config = getConfig();
  fs.writeFileSync(path.join(homedir, '.aicommit.old'), JSON.stringify(config));
  fs.writeFileSync(path.join(homedir, '.aicommit'), JSON.stringify({}));
};

export const restoreConfig = (pathBackup: string): void => {
  const backup = fs.readFileSync(pathBackup).toString();

  fs.writeFileSync(path.join(homedir, '.aicommit'), backup);
};