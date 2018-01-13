#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const readline = require("readline");
var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('pkg_tools> ');
rl.prompt();
function parseCommand(line) {
    var argv = yargs(line.trim())
        .commandDir('cmds')
        .help('h')
        .alias('h', 'help')
        .epilog('copyright by @godghdai 2017')
        .exitProcess(false)
        .fail((msg) => {
        // msg.should.match(/Implications failed/) return done()
        console.log(msg);
    })
        .argv;
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