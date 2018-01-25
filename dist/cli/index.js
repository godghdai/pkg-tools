#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const yargs = require("yargs");
//https://github.com/nodejs/node/blob/master/lib/readline.js
const readline = require("readline");
config_1.default.load();
//提示
function completer(line) {
    const completions = 'clone quit exit search url versions translate'.split(' ');
    const hits = completions.filter((c) => c.startsWith(line));
    return [
        hits.length
            ? hits
            : completions,
        line
    ];
}
var prev_action = null;
//翻页按键监听
process
    .stdin
    .on('keypress', function (s, key) {
    if (!key.ctrl || prev_action == null)
        return;
    switch (key.name) {
        case 'up':
            if (prev_action.type == "search") {
                let prev = prev_action.argv.page - 1;
                if (prev < 1)
                    prev = 1;
                prev_action.argv.page = prev;
                prev_action.handler(prev_action.argv);
            }
            break;
        case 'down':
            if (prev_action.type == "search") {
                let next = prev_action.argv.page + 1;
                prev_action.argv.page = next;
                prev_action.handler(prev_action.argv);
            }
            break;
    }
});
var rl = readline.createInterface(process.stdin, process.stdout, completer), parse = yargs.config({
    _commandComplete: function (action) {
        switch (action.type) {
            case 'search':
                console.log(action.playload);
                prev_action = action;
                break;
            case 'exit':
                rl.close();
                break;
            default:
                prev_action = null;
        }
        rl.prompt();
    }
})
    .commandDir('cmds')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright by @godghdai 2017')
    .exitProcess(false)
    .fail((msg) => console.log(msg));
rl.on('line', line => parse.parse(line.trim()));
rl.on('close', function () {
    console.log('bye bye!');
    process.exit(0);
});
rl.setPrompt('pkg_tools> ');
rl.prompt();
//# sourceMappingURL=index.js.map