#!/usr/bin/env node

import * as yargs from 'yargs';
import * as readline from 'readline';

var rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('pkg_tools> ');
rl.prompt();

function parseCommand(line : any) {
  var argv = yargs(line.trim())
    .commandDir('cmds')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright by @godghdai 2017')
    .exitProcess(false)
    .fail((msg : any) => {
      // msg.should.match(/Implications failed/) return done()
      console.log(msg);
    })
    //.locale('zh_CN')
    .argv
}
parseCommand("");

rl.on('line', function (line) {

  parseCommand(line);

});

rl.on('close', function () {
  console.log('bye bye!');
  process.exit(0);
});
