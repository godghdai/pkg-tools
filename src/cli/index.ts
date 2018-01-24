#!/usr/bin/env node

import config from "../config"
import * as yargs from 'yargs';
import * as readline from 'readline';

config.load();

function completer(line : any) {
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

type action = {
  type: string,
  argv: any,
  handler: (args : any) => void,
  playload: any
}

var prev_action : action = null;
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

function _commandComplete(action : action) {
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
  .config({_commandComplete})
  .commandDir('cmds')
  .help('h')
  .alias('h', 'help')
  .epilog('copyright by @godghdai 2017')
  .exitProcess(false)
  .fail((msg : any) => {
    // msg.should.match(/Implications failed/) return done()
    console.log(msg);
  })
function parseCommand(line : any) {
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
