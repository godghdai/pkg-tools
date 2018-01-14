"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require('chalk');
var Table = require('tty-table');
const index_1 = require("../../lib/translate/index");
exports.command = 'translate <word>';
exports.aliases = ['t'];
exports.describe = 'translate the word';
exports.builder = function (yargs) {
    return yargs
        .demand('word')
        .option('engine', {
        alias: 'e',
        describe: 'choose a engine baidu|qq|youdao short b q y',
        choices: ['b', 'q', 'y']
    })
        .default('engine', 'y');
};
exports.handler = function (argv) {
    if (argv.word == "")
        return;
    index_1.getEngineInstance(argv.e)
        .translate(argv.word)
        .then(data => {
        console.log(data.to);
        argv._callback();
    })
        .catch(ex => {
        console.log(chalk.red("not find!!"));
        argv._callback();
    });
};
//# sourceMappingURL=translate.js.map