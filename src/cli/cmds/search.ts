import git from "../../lib/git";
import npm from "../../lib/npm";
var Table = require('tty-table');
import {validRange} from 'semver';

exports.command = 'search <pkgname>';

exports.aliases = ['s'];

exports.describe = 'search package name';

exports.builder = function (yargs : any) {
  return yargs
    .demand('pkgname')
    .default('pkgname', '')
    .option('limit', {
      alias: 'l',
      describe: "'result limit"
    })
    .default('limit', 2)
    .option('size', {
      alias: 's',
      describe: 'choose a size',
      choices: ['xs', 's', 'm', 'l', 'xl']
    })
}

exports.handler = function (argv : any) {
  if (argv.pkgname == "")
    return;
  npm
    .search(argv.pkgname, argv.limit)
    .then(data2 => {

      var header = [
        {
          value: "name"
        }, {
          value: "desc"
        }, {
          value: "git"
        }, {
          value: "npm"
        }
      ];

      var rows : any[] = [];

      data2.forEach(obj => {
        rows.push([obj.name, obj.desc, obj.git, obj.npm]);
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
