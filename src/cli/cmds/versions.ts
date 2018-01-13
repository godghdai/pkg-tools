import git from "../../lib/git";
import npm from "../../lib/npm";
var Table = require('tty-table');
import {validRange} from 'semver';

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
    .default('range', "*")
    .option('g', {
      alias: 'g',
      describe: "'result from git website,default from npm"
    })
    .default('g', false)
}

exports.handler = function (argv : any) {

  // console.log(argv);
  if (argv.pkgname == "")
    return;
  var p = null;

  if (validRange(argv.range)) {
    p = argv.g
      ? git.getVersionsByRange(argv.pkgname, argv.range, argv.limit)
      : npm.getVersionsByRange(argv.pkgname, argv.range, argv.limit);
  } else {
    p = argv.g
      ? git.getLastVersions(argv.pkgname, argv.limit)
      : npm.getLastVersions(argv.pkgname, argv.limit);
  }

  p.then(data => {

    var header = [
      {
        value: "num",
        width: 10,
        color: 'white'
      }, {
        value: "version"
      }
    ];

    var rows : any[] = [];

    data.forEach((obj, index) => {
      rows.push([index, obj]);
    });

    var t1 = Table(header, rows, {
      borderStyle: 2,
      headerAlign: "center",
      align: "center",
      color: "white"
    });

    var str1 = t1.render();
    console.log(str1);
  })
}
