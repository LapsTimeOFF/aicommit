import fs from 'fs';
import os from 'os';
import path from 'path';

export interface IConfig {
  emoji?: boolean;
}

export const getConfig = (): IConfig | false => {
  const homedir = os.homedir();

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
