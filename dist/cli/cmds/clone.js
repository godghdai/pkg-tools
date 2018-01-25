"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const git_1 = require("../../lib/git");
const npm_1 = require("../../lib/npm");
const url_1 = require("../../lib/util/git/url");
const tools_1 = require("../../lib/tools");
exports.command = 'clone <pkgname>';
exports.aliases = ['c'];
exports.describe = 'clone package from git';
exports.builder = function (yargs) {
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
        .default('m', false);
};
exports.handler = function (argv) {
    return clone(argv);
};
function clone(argv) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (argv.pkgname == "")
            return;
        var json = yield npm_1.default.getPackageJson(argv.pkgname), ver = json["dist-tags"]["latest"], packjson = json["versions"][ver], giturl = null;
        const { type, url } = packjson.repository;
        if (type == "git" && url != "") {
            giturl = url_1.urlParse(url);
        }
        if (argv.m)
            yield git_1.default.clone(giturl);
        var dependencies = packjson.dependencies, keys = Object.keys(dependencies), filterReg = new RegExp(argv.filter), includeReg = new RegExp(argv.include);
        for (let index = 0; index < keys.length; index++) {
            var packname = keys[index];
            if (includeReg.test(packname)) {
                if (filterReg.test(packname)) {
                    continue;
                }
                console.log(chalk_1.default.green(`开始克隆${packname}……`));
                giturl = yield tools_1.getGitUrlByPackName(packname);
                yield git_1.default.clone(giturl, ".");
                console.log(chalk_1.default.red(`${packname}克隆完成！！`));
                console.log(chalk_1.default.green('------------------------------------'));
            }
        }
        argv._commandComplete({ type: "clone", argv, handler: exports.handler });
    });
}
//# sourceMappingURL=clone.js.map