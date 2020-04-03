const chalk = require('chalk');
const { parallel, series } = require('gulp');
const logger = require('gulplog');
const path = require('path');
const shell = require('shelljs');

const __packages = path.resolve(__dirname, 'packages');

const packages = [{
  name: 'core',
  finishToken: 'waiting for changes before restart',
  initialized: false,
}, {
  name: 'view',
  finishToken: 'Entrypoint',
  initialized: false,
}, {
  name: 'code',
  finishToken: 'Watching for file changes',
  initialized: false,
}];

const [coreTask, viewTask, codeTask] = packages.map(packageInfo => {
  const { name, finishToken } = packageInfo;
  const task = (cb) => {
    shell.cd(path.resolve(__packages, name));
    const child = shell.exec('npm run watch', { async: true, silent: true });
    child.stdout.on('data', data => {
      if (data.includes(finishToken)) {
        if (packageInfo.initialized) {
          logger.info(`Rebuilt Done '${chalk.cyan(`watch:${name}`)}'`);
        }
        cb();
        packageInfo.initialized = true;
      }
    });
    child.stderr.on('data', data => {
      logger.error(`${chalk.cyan(`watch:${name}`)}${chalk.red('!')} ${data}`);
    });
  };
  task.displayName = `watch:${name}`;
  return task;
});

exports.default = parallel(coreTask, series(viewTask, codeTask));
