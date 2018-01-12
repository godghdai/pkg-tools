#!/usr/bin/env node

/*
var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('count', 'Count the lines in a file')
    .example('$0 count -f foo.js', 'count the lines in the given file')
    .alias('f', 'file')
    .nargs('f', 1)
    .describe('f', 'Load a file')
    .demandOption(['f'])
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2015')
    .argv;

var fs = require('fs');
var s = fs.createReadStream(argv.file);

var lines = 0;
s.on('data', function (buf) {
    lines += buf.toString().match(/\n/g).length;
});

s.on('end', function () {
    console.log(lines);
});
*/
import * as yargs from 'yargs';

yargs.command([
  'Search package <key>', 'search', 's'
], 'Search package name', {}, (argv) => {

  console.log('starting up the', argv.name|| 'default', 'app')
}).command({
  command: 'configure <key> [value]',
  aliases: [
    'config', 'cfg'
  ],
  describe: 'Set a config variable',
  builder: (yargs) => yargs.default('value', 'true'),
  handler: (argv) => {
    console.log(`setting ${argv.key} to ${argv.value}`)
  }
})
  .demandCommand()
  .help('h')
  .alias('h', 'help')
  .epilog('copyright by @godghdai 2017')
  .argv
