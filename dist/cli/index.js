#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
yargs.command([
    'Search package <key>', 'search', 's'
], 'Search package name', {}, (argv) => {
    console.log('starting up the', argv.name || 'default', 'app');
}).command({
    command: 'configure <key> [value]',
    aliases: [
        'config', 'cfg'
    ],
    describe: 'Set a config variable',
    builder: (yargs) => yargs.default('value', 'true'),
    handler: (argv) => {
        console.log(`setting ${argv.key} to ${argv.value}`);
    }
})
    .demandCommand()
    .help('h')
    .alias('h', 'help')
    .epilog('copyright by @godghdai 2017')
    .argv;
//# sourceMappingURL=index.js.map