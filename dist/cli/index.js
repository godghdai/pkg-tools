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
//https://github.com/nodejs/node/blob/master/lib/readline.js
var rl = readline.createInterface(process.stdin, process.stdout, completer);
process
    .stdin
    .on('keypress', function (s, key) {
    //console.log(key);
});
rl.setPrompt('pkg_tools> ');
rl.prompt();
var parse = yargs.config({
    _callback: function () {
        rl.prompt();
        //console.log("load..");
    }
})
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
    //console.log(argv);
    //.locale('zh_CN')
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