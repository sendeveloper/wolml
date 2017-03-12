const ora = require('ora');
const spawn = require('child_process').spawn;

const DEPENDENCIES = [
  'apisauce',
  'react-native-fabric',
  'react-native-renavigate',
  'react-redux',
  'redux',
  'redux-thunk',
  'reselect',
  'seamless-immutable'
];

const DEV_DEPENDENCIES = [
  'babel-eslint',
  'eslint',
  'eslint-config-airbnb',
  'eslint-config-prettier',
  'eslint-plugin-flowtype',
  'eslint-plugin-import',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-prettier',
  'eslint-plugin-react',
  'prettier',
  'prettier-eslint',
  'jest-react-native',
  'reactotron-apisauce',
  'reactotron-react-native',
  'reactotron-redux'
];

function installDependencies(projectName, deps, options, dev) {
  return new Promise(function (resolve, reject) {
    const args = dev ? ['add', '--dev'].concat(deps) : ['add'].concat(deps)
    const command = spawn('yarn', args, { cwd: `${process.cwd()}/${projectName}` });

    command.stdout.on('data', (data) => {
      if (options.verbose && data) {
        console.log(data.toString());
      }
    });

    command.stderr.on('data', (data) => {
      if (options.verbose && data) {
        const msg = data.toString();
        console.log(/warning/.test(msg) ? msg.yellow : msg.red);
      }
    });

    command.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        console.log('Dependencies installation failed. Turn verbose mode on for detailed logging'.red);
        reject();
      }
    });
  });
}

module.exports = function(projectName, options) {
  const spinner = ora({ spinner: 'bouncingBall', text: 'Fetching dependencies' }).start();
  return installDependencies(projectName, DEPENDENCIES, options).then(() => {
    return installDependencies(projectName, DEV_DEPENDENCIES, options, true)
  }).then(() => {
    spinner.succeed('Dependencies ready!');
  }).catch(() => {
    spinner.fail('Dependencies installation failed. Turn verbose mode on for detailed logging');
    process.exit(1);
  });
}
