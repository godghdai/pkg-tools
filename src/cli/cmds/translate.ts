import chalk from 'chalk';
import {translate} from '../../lib/translate';

exports.command = 'translate <word>';
exports.aliases = ['t'];
exports.describe = 'translate the word';

exports.builder = function (yargs : any) {
  return yargs
    .demand('word')
    .option('engine', {
      alias: 'e',
      describe: 'choose a engine baidu|qq|youdao short b q y',
      choices: ['b', 'q', 'y']
    })
    .default('engine', 'y')
}

exports.handler = function (argv : any) {
  if (argv.word == "")
    return;

    translate(argv.word,argv.e)
    .then(data => {
      console.log(data.to);
      argv._callback();
    })
    .catch(ex => {
      console.log(chalk.red("not find!!"));
      argv._callback();
    });
}
