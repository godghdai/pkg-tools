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
  .fail((msg : any) => {
    // msg.should.match(/Implications failed/) return done()
    console.log(msg);
  })
function parseCommand(line : any) {
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
