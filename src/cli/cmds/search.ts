import * as table from "tty-table";
import {validRange} from 'semver';

import git from "../../lib/git";
import npm from "../../lib/npm";
import {translate} from '../../lib/translate';

const {RESULT_LIST_LIMIT_DEFAULT, TRANSLATE_ENGINE_SELECT_DEFAULT} = CONFIG;

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
    .option('g', {
      alias: 'g',
      describe: "'result from git website,default from npm"
    })
    .default('g', false)
    .option('page', {
      alias: 'p',
      describe: "'page index"
    })
    .default('page', 1)
    .option('trans', {
      alias: 't',
      describe: "'translate the pkgname"
    })
    .default('t', false)
}

const header = [
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

exports.handler = function (argv : any) {
  return search(argv);
}

async function search(argv : any) : Promise < string > {

  if(argv.pkgname == "") 
    return;
  var command: any = argv.g
    ? git
    : npm;

  var page = argv.g
    ? argv.page
    : argv.page - 1;

  if (argv.trans) {
    const {to} = await translate(argv.pkgname, TRANSLATE_ENGINE_SELECT_DEFAULT.charAt(0));
    argv.pkgname=to;
  }

  command
    .search(argv.pkgname, argv.limit, page)
    .then((data2 : any) => {
      var rows : any[] = [];

      data2.forEach((obj : any) => {
        rows.push([obj.name, obj.desc, obj.git, obj.npm]);
      });

      var t1 = table(header, rows, {
        borderStyle: 2,
        headerAlign: "center",
        align: "center",
        color: "white"
      });

      argv._commandComplete({
        type: "search",
        argv,
        handler: exports.handler,
        playload: t1.render()
      });
    })
}