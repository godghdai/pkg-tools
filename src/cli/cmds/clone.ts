import {validRange} from 'semver';
import chalk from 'chalk';
import git from "../../lib/git";
import npm from "../../lib/npm";
import {urlParse} from "../../lib/util/git/url";
import {getGitUrlByPackName} from "../../lib/tools";

exports.command = 'clone <pkgname>';
exports.aliases = ['c'];
exports.describe = 'clone package from git';

exports.builder = function (yargs : any) {
    return yargs
        .demand('pkgname')
        .option('filter', {
            alias: 'f',
            describe: "'过滤包名的正则"
        })
        .default('filter', "@types")
        .option('include', {
            alias: 'i',
            describe: "'保留包名的正则"
        })
        .default('include', "*")
        .option('main', {
            alias: 'm',
            describe: "'是否clone主包"
        })
        .default('m', false)
}

exports.handler = function (argv : any) {
    return clone(argv);
}

async function clone(argv : any) : Promise < string > {

    if(argv.pkgname == "") 
        return;
    
    var json = await npm.getPackageJson(argv.pkgname),
        ver = json["dist-tags"]["latest"],
        packjson = json["versions"][ver],
        giturl = null;

    const {type, url} = packjson.repository;
    if (type == "git" && url != "") {
        giturl = urlParse(url);
    }

    if (argv.m) 
        await git.clone(giturl);
    
    var dependencies = packjson.dependencies,
        keys = Object.keys(dependencies),
        filterReg = new RegExp(argv.filter),
        includeReg = new RegExp(argv.include);
    for (let index = 0; index < keys.length; index++) {
        var packname = keys[index];

        if (includeReg.test(packname)) {
            if (filterReg.test(packname)) {
                continue;
            }
            console.log(chalk.green(`开始克隆${packname}……`));
            giturl = await getGitUrlByPackName(packname);
            await git.clone(giturl, ".");
            console.log(chalk.red(`${packname}克隆完成！！`));
            console.log(chalk.green('------------------------------------'));
        }

    }

    argv._commandComplete({type: "clone", argv, handler: exports.handler});

}