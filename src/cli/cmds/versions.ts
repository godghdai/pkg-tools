import * as table from "tty-table";
import {validRange} from 'semver';

import git from "../../lib/git";
import npm from "../../lib/npm";
import * as tools from "../../lib/tools";

const {RESULT_LIST_LIMIT_DEFAULT} = CONFIG;
const isUrl = (url : string) => /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url);

exports.command = 'versions <pkgname> [range]';
exports.aliases = ['ver', 'v'];
exports.describe = '查询包的版本';

exports.builder = function (yargs : any) {
  return yargs
    .demand('pkgname')
    .default('pkgname', '')
    .option('limit', {
      alias: 'l',
      describe: "'返回的条目数"
    })
    .default('limit', RESULT_LIST_LIMIT_DEFAULT)
    .option('range', {
      alias: 'r',
      describe: "根据条件(semver range)过滤版本列表"
    })
    .default('range', "*")
    .option('g', {
      alias: 'g',
      describe: "从github获取版本，默认从npm"
    })
    .default('g', false)
}

exports.handler = function (argv : any) {
  search(argv).then(res => {
    console.log(res);
    argv._commandComplete({type: "versions"});
  }).catch(err => {})
}

async function search(argv : any) : Promise < string > {

  if(argv.pkgname == "") 
    return;
  var p: Promise < Array < string >> = null,
    command: any = argv.g
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

  var versions = await p,
    rows: any[] = [];

  versions.forEach((obj, index) => {
    rows.push([index, obj]);
  });

  return table([
    {
      value: "num",
      width: 10,
      color: 'white'
    }, {
      value: "version"
    }
  ], rows, {
    borderStyle: 2,
    headerAlign: "center",
    align: "center",
    color: "white"
  }).render();

}
