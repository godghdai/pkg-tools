import * as table from "tty-table";
import {validRange} from 'semver';

import git from "../../lib/git";
import npm from "../../lib/npm";
import * as tools from "../../lib/tools";

exports.command = 'versions <pkgname> [range]';
exports.aliases = ['ver', 'v'];
exports.describe = 'get the package versions';

exports.builder = function (yargs : any) {
  return yargs
    .demand('pkgname')
    .default('pkgname', '')
    .option('limit', {
      alias: 'l',
      describe: "'result limit"
    })
    .default('limit', 5)
    .option('range', {
      alias: 'r',
      describe: "'range limit"
    })
    .default('range', "*")
    .option('g', {
      alias: 'g',
      describe: "'result from git website,default from npm"
    })
    .default('g', false)
}

exports.handler = function (argv : any) {
  search(argv).then(res => {
    console.log(res);
    argv._callback();
  }).catch(err => {})
}

var header = [
  {
    value: "num",
    width: 10,
    color: 'white'
  }, {
    value: "version"
  }
];

function isUrl(url : string) {
  return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url);
}

async function search(argv : any) : Promise < string > {

  if(argv.pkgname == "")
    return;
  var p: Promise < Array < string >> = null;
  var command: any = argv.g
    ? git
    : npm;

  if (argv.g) {
    if (!isUrl(argv.pkgname))
      argv.pkgname = await tools.getGitUrlByPackName(argv.pkgname);
    }

  if (validRange(argv.range)) {
    p = command.getVersionsByRange(argv.pkgname, argv.range, argv.limit);
  } else {
    p = command.getLastVersions(argv.pkgname, argv.limit);
  }

  var versions = await p;
  var rows: any[] = [];

  versions.forEach((obj, index) => {
    rows.push([index, obj]);
  });

  var t1 = table(header, rows, {
    borderStyle: 2,
    headerAlign: "center",
    align: "center",
    color: "white"
  });

  return t1.render();

}
