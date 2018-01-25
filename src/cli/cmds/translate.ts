import chalk from 'chalk';
import {translate} from '../../lib/translate';

const {TRANSLATE_ENGINE_SELECT_DEFAULT} = CONFIG;

exports.command = 'translate <word>';
exports.aliases = ['t'];
exports.describe = '查单词';

exports.builder = function (yargs : any) {
  return yargs
    .demand('word')
    .option('engine', {
      alias: 'e',
      describe: '翻译引擎 baidu|qq|youdao short b q y',
      choices: ['b', 'q', 'y']
    })
    .default('engine', TRANSLATE_ENGINE_SELECT_DEFAULT.charAt(0))
}

exports.handler = function (argv : any) {
  if (argv.word == "") 
    return;
  
  translate(argv.word, argv.e).then(data => {
    console.log(data.to);
    argv._commandComplete({type: "translate"});
  }).catch(ex => {
    console.log(chalk.red("not find!!"));
    argv._commandComplete({type: "translate"});
  });
}
