import childProcess from 'child_process';

const cachedFiles = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

export const getDiff = (): string => {
  const stdout = childProcess.execSync('git diff --staged -- ' + getStagedFiles().join(' ')).toString();
  return stdout;
};

export const commit = (message: string): string => {
  return childProcess.execSync(`git commit -m "${message}"`).toString();
};
export const push = (): string => {
  return childProcess.execSync('git push').toString();
};

export const getStagedFiles = (): string[] => {
  const stdout = childProcess.execSync('git diff --staged --name-only').toString();
  return stdout.split('\n').filter((file) => !cachedFiles.includes(file)).filter((file) => file !== '');
};