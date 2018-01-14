import {getGitUrlByPackName} from "../../lib/tools";
exports.command = 'url <packname>';

exports.aliases = ['u'];

exports.describe = 'get packname git url';

exports.builder = function (yargs : any) {}

exports.handler = function (argv : any) {
  if (argv.pkgname == "")
    return;

  getGitUrlByPackName(argv.packname).then(a => {
    console.log(a);
    argv._callback();
  }).catch(ex => {
    console.log(ex);
    argv._callback();
  });

}
