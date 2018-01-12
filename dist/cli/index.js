#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const npm_1 = require("../lib/npm");
const youdao_1 = require("../lib/translate/youdao");
var youdao_c = new youdao_1.default();
const yargs = require("yargs");
const readline = require("readline");
var rl = readline.createInterface(process.stdin, process.stdout);
const chalk = require('chalk');
var Table = require('tty-table');
rl.setPrompt('pkg_tools> ');
rl.prompt();
rl.on('line', function (line) {
    var argv = yargs(line.trim()).command({
        command: 'search <pkgname>',
        aliases: [
            's'
        ],
        describe: 'search package name',
        builder: (yargs) => {
            return yargs
                .demand('pkgname')
                .default('pkgname', '')
                .option('limit', {
                alias: 'l',
                describe: "'result limit",
            })
                .default('limit', 2);
        },
        handler: (argv) => {
            if (argv.pkgname == "")
                return;
            npm_1.default
                .search(argv.pkgname, argv.limit)
                .then(data2 => {
                var header = [
                    {
                        value: "name"
                    }, {
                        value: "desc"
                    }, {
                        value: "git"
                    }, {
                        value: "npm"
                    }
                ];
                var rows = [];
                data2.forEach(obj => {
                    rows.push([obj.name, obj.desc, obj.git, obj.npm]);
                });
                var t1 = Table(header, rows, {
                    borderStyle: 2,
                    headerAlign: "center",
                    align: "center",
                    color: "white"
                });
                var str1 = t1.render();
                console.log(str1);
                rl.prompt();
            });
        }
    }).command({
        command: 'versions <pkgname>',
        aliases: [
            'ver', 'v'
        ],
        describe: 'get the package versions',
        builder: (yargs) => {
            return yargs
                .demand('pkgname')
                .default('pkgname', '')
                .option('limit', {
                alias: 'l',
                describe: "'result limit",
            })
                .default('limit', 5)
                .option('range', {
                alias: 'r',
                describe: "'range limit",
            });
        },
        handler: (argv) => {
            if (argv.pkgname == "")
                return;
            console.log(argv);
            npm_1.default
                .getLastVersions(argv.pkgname, argv.limit)
                .then(data => {
                var header = [
                    {
                        value: "version"
                    }
                ];
                var rows = [];
                data.forEach(obj => {
                    rows.push([obj]);
                });
                var t1 = Table(header, rows, {
                    borderStyle: 2,
                    headerAlign: "center",
                    align: "center",
                    color: "white"
                });
                var str1 = t1.render();
                console.log(str1);
                rl.prompt();
            }).catch(ex => {
                console.log(chalk.red("not find!!"));
                rl.prompt();
            });
        }
    }).command({
        command: 'translate <word>',
        aliases: [
            't'
        ],
        describe: 'translate the word',
        builder: (yargs) => {
            return yargs
                .demand('word');
        },
        handler: (argv) => {
            if (argv.word == "")
                return;
            youdao_c
                .translate(argv.word)
                .then(data => {
                console.log(data.to);
                rl.prompt();
            }).catch(ex => {
                console.log(chalk.red("not find!!"));
                rl.prompt();
            });
        }
    }).command({
        command: 'quit',
        aliases: [
            'q', 'exit'
        ],
        describe: 'quit the commander',
        builder: {},
        handler: (argv) => {
            rl.close();
        }
    })
        .demandCommand(1, 'must provide a valid command')
        .help('h')
        .alias('h', 'help')
        .epilog('copyright by @godghdai 2017')
        .exitProcess(false)
        .fail((msg) => {
        // msg.should.match(/Implications failed/) return done()
        console.log(msg);
    })
        .locale('zh_CN')
        .argv;
});
rl.on('close', function () {
    console.log('bye bye!');
    process.exit(0);
});
//# sourceMappingURL=index.js.map