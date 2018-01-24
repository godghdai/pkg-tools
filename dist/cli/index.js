#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const yargs = require("yargs");
const readline = require("readline");
config_1.default.load();
function completer(line) {
    const completions = 'help error exit quit q'.split(' ');
    const hits = completions.filter((c) => c.startsWith(line));
    // show all completions if none found
    return [
        hits.length
            ? hits
            : completions,
        line
    ];
}
var prev_action = null;
//https://github.com/nodejs/node/blob/master/lib/readline.js
var rl = readline.createInterface(process.stdin, process.stdout, completer);
process
    .stdin
    .on('keypress', function (s, key) {
    if (!key.ctrl)
        return;
    switch (key.name) {
        case 'up':
            if (prev_action != null && prev_action.type == "search") {
                let prev = prev_action.argv.page - 1;
                if (prev < 1)
                    prev = 1;
                prev_action.argv.page = prev;
                prev_action.handler(prev_action.argv);
            }
            break;
        case 'down':
            if (prev_action != null && prev_action.type == "search") {
                let next = prev_action.argv.page + 1;
                prev_action.argv.page = next;
                prev_action.handler(prev_action.argv);
            }
            break;
    }
});
rl.setPrompt('pkg_tools> ');
rl.prompt();
function _commandComplete(action) {
    switch (action.type) {
        case 'search':
            console.log(action.playload);
            prev_action = action;
            break;
        default:
            prev_action = null;
    }
    rl.prompt();
}
var parse = yargs
    .config({ _commandComplete })
    .commandDir('cmds')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright by @godghdai 2017')
    .exitProcess(false)
    .fail((msg) => {
    // msg.should.match(/Implications failed/) return done()
    console.log(msg);
});
function parseCommand(line) {
    var argv = parse.parse(line.trim());
    //console.log(argv); .locale('zh_CN')
}
parseCommand("");
rl.on('line', function (line) {
    parseCommand(line);
});
rl.on('close', function () {
    console.log('bye bye!');
    process.exit(0);
});
//# sourceMappingURL=index.js.map