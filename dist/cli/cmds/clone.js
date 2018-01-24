"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const git_1 = require("../../lib/git");
const npm_1 = require("../../lib/npm");
const url_1 = require("../../lib/util/git/url");
const tools_1 = require("../../lib/tools");
exports.command = 'clone <pkgname>';
exports.aliases = ['c'];
exports.describe = 'clone package from git';
exports.builder = function (yargs) {
    return yargs.demand('pkgname');
};
exports.handler = function (argv) {
    return clone(argv);
};
function clone(argv) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (argv.pkgname == "")
            return;
        var json = yield npm_1.default.getPackageJson(argv.pkgname);
        var ver = json["dist-tags"]["latest"];
        var packjson = json["versions"][ver];
        var giturl = null;
        const { type, url } = packjson.repository;
        if (type == "git" && url != "") {
            giturl = url_1.urlParse(url);
        }
        yield git_1.default.clone(giturl);
        var dependencies = packjson.dependencies;
        var keys = Object.keys(dependencies);
        for (let index = 0; index < keys.length; index++) {
            //const dev = dependencies[keys[index]];
            giturl = yield tools_1.getGitUrlByPackName(keys[index]);
            yield git_1.default.clone(giturl, ".");
        }
        return "";
    });
}
//# sourceMappingURL=clone.js.map