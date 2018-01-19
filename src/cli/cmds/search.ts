import * as table from "tty-table";
import {validRange} from 'semver';

import git from "../../lib/git";
import npm from "../../lib/npm";

const {RESULT_LIST_LIMIT_DEFAULT} = CONFIG;

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
    .default('limit', RESULT_LIST_LIMIT_DEFAULT)
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


      var t1 = table(header, rows, {
        borderStyle: 2,
        headerAlign: "center",
        align: "center",
        color: "white"
      });
       console.log( t1.render());
       argv._callback();
    })
}
