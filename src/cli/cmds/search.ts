import * as table from "tty-table";
import {validRange} from 'semver';

import git from "../../lib/git";
import npm from "../../lib/npm";
import {translate} from '../../lib/translate';

const {RESULT_LIST_LIMIT_DEFAULT, TRANSLATE_ENGINE_SELECT_DEFAULT} = CONFIG;

exports.command = 'search <pkgname>';
exports.aliases = ['s'];
exports.describe = '从github或者npm搜索包';

exports.builder = function (yargs : any) {
  return yargs
    .demand('pkgname')
    .default('pkgname', '')
    .option('limit', {
      alias: 'l',
      describe: "'每页显示的条目"
    })
    .default('limit', RESULT_LIST_LIMIT_DEFAULT)
    .option('g', {
      alias: 'g',
      describe: "'从github搜索包，默认从npm"
    })
    .default('g', false)
    .option('page', {
      alias: 'p',
      describe: "'分页显示，第几页"
    })
    .default('page', 1)
    .option('trans', {
      alias: 't',
      describe: "'按翻译后包名搜索，中文转英文或者英文转中文"
    })
    .default('t', false)
}

exports.handler = async(argv : any) : Promise < string >=> {

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
    argv.pkgname = to;
  }

  command
    .search(argv.pkgname, argv.limit, page)
    .then((data2 : any) => {
      var rows : any[] = [];

      data2.forEach((obj : any) => {
        rows.push([obj.name, obj.desc, obj.git, obj.npm]);
      });

      var t1 = table([
        {
          value: "name"
        }, {
          value: "desc"
        }, {
          value: "git"
        }, {
          value: "npm"
        }
      ], rows, {
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