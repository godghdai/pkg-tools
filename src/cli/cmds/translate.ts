import git from "../../lib/git";
import npm from "../../lib/npm";

const chalk = require('chalk');
var Table = require('tty-table');
import {validRange} from 'semver';

import youdao from "../../lib/translate/youdao";
var youdao_c = new youdao();

exports.command = 'translate <word>';

exports.aliases = ['t'];

exports.describe = 'translate the word';

exports.builder = function (yargs : any) {
  return yargs.demand('word');
}

exports.handler = function (argv : any) {
  if (argv.word == "")
    return;
  youdao_c
    .translate(argv.word)
    .then(data => {
      console.log(data.to);

    })
    .catch(ex => {
      console.log(chalk.red("not find!!"));
    });
}
