import {validRange} from 'semver';

import git from "../../lib/git";
import npm from "../../lib/npm";
import {urlParse} from "../../lib/util/git/url";
import {getGitUrlByPackName} from "../../lib/tools";

exports.command = 'clone <pkgname>';
exports.aliases = ['c'];
exports.describe = 'clone package from git';

exports.builder = function (yargs : any) {
    return yargs.demand('pkgname')
}

exports.handler = function (argv : any) {
    return clone(argv);
}

async function clone(argv : any) : Promise < string > {

    if(argv.pkgname == "") 
        return;
    var json = await npm.getPackageJson(argv.pkgname);
    var ver = json["dist-tags"]["latest"];
    var packjson = json["versions"][ver];
    var giturl = null;
    const {type, url} = packjson.repository;
    if (type == "git" && url != "") {
        giturl = urlParse(url);
    }
    await git.clone(giturl);
    var dependencies = packjson.dependencies;
    var keys = Object.keys(dependencies);
    for (let index = 0; index < keys.length; index++) {
        //const dev = dependencies[keys[index]];
        giturl = await getGitUrlByPackName(keys[index]);
        await git.clone(giturl,".");
    }
    return "";
}