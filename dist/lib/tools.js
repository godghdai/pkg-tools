"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const git_1 = require("./git");
const npm_1 = require("./npm");
const url_1 = require("./util/git/url");
const chalk_1 = require("chalk");
function getGitUrlByPackName(packname) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var result = yield npm_1.default
            .getPackageJson(packname)
            .catch(ex => Promise.resolve(null));
        if (result != null) {
            const { type, url } = result.repository;
            if (type == "git" && url != "")
                return url_1.urlParse(url);
        }
        var packageInfos;
        console.log(chalk_1.default.grey(`search ${chalk_1.default.yellow(packname)} from npm....`));
        packageInfos = yield npm_1.default
            .search(packname)
            .catch(ex => Promise.resolve(null));
        if (packageInfos != null && packageInfos.length > 0) {
            return packageInfos[0].git;
        }
        console.log(chalk_1.default.grey(`search ${chalk_1.default.yellow(packname)} from git....`));
        packageInfos = yield git_1.default
            .search(packname)
            .catch(ex => Promise.resolve(null));
        if (packageInfos != null && packageInfos.length > 0) {
            return packageInfos[0].git;
        }
        return "not find";
    });
}
exports.getGitUrlByPackName = getGitUrlByPackName;
//# sourceMappingURL=tools.js.map