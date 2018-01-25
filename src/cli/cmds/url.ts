import {getGitUrlByPackName} from "../../lib/tools";

exports.command = 'url <packname>';
exports.aliases = ['u'];
exports.describe = '获取giturl';

exports.builder = function (yargs : any) {}
exports.handler = function (argv : any) {
  if (argv.pkgname == "")
    return;

  getGitUrlByPackName(argv.packname).then(a => {
    console.log(a);
    argv._commandComplete({
      type: "url"
    });
  }).catch(ex => {
    console.log(ex);
    argv._commandComplete({
      type: "url"
    });
  });

}
