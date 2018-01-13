"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require('chalk');
var Table = require('tty-table');
const youdao_1 = require("../../lib/translate/youdao");
var youdao_c = new youdao_1.default();
exports.command = 'translate <word>';
exports.aliases = ['t'];
exports.describe = 'translate the word';
exports.builder = function (yargs) {
    return yargs.demand('word');
};
exports.handler = function (argv) {
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
};
//# sourceMappingURL=translate.js.map