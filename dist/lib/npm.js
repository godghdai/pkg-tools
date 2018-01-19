"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const request_1 = require("./request");
const semver_1 = require("semver");
const cmd_1 = require("./cmd");
const { NPM_REGISTRY_URL, NPM_SEARCH_URL, RESULT_LIST_LIMIT_DEFAULT, PACKAGE_CMDS_SELECT_DEFAULT } = CONFIG;
function getNpmCmd() {
    /*
    var cmds = ["cnpm", "npm"];
    var index = cmds.findIndex((value, index, arr) => !!which.sync(value, {nothrow: true}));
    if (index != -1)
      return cmds[index] + (process.platform === 'win32'
        ? ".cmd"
        : "");
  */
    return PACKAGE_CMDS_SELECT_DEFAULT + (process.platform === 'win32'
        ? ".cmd"
        : "");
}
const npmCmd = cmd_1.getCmdInstance(getNpmCmd());
class Npm {
    getPackageJson(packageName) {
        var res = request_1.getJson({
            url: `${NPM_REGISTRY_URL}/${packageName}`,
            headers: {
                'Host': 'registry.cnpmjs.org'
            }
        });
        return res;
    }
    lastVersions(json, limit) {
        return Object
            .keys(json["versions"])
            .filter(ver => semver_1.valid(ver))
            .sort(semver_1.rcompare)
            .slice(0, limit || RESULT_LIST_LIMIT_DEFAULT);
    }
    getVersions(packageName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var outstr = yield npmCmd.run(['view', packageName, 'versions', '--json']);
            var versions = JSON.parse(outstr.toString());
            return versions.filter((ver) => semver_1.valid(ver)).sort(semver_1.rcompare);
            // .slice(0, 10)
        });
    }
    getLastVersions(packageName, limit) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var data = yield this.getPackageJson(packageName);
            return this.lastVersions(data, limit || RESULT_LIST_LIMIT_DEFAULT);
        });
    }
    getVersionsByRange(packageName, range, limit) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var vers = yield this.getVersions(packageName);
            return vers
                .filter(ver => semver_1.satisfies(ver, range, true))
                .slice(0, limit || RESULT_LIST_LIMIT_DEFAULT);
        });
    }
    static SearchResultConvert(items) {
        return items.map(item => {
            const { name, description: desc, links: { repository: git, npm } } = item["package"];
            return { name, desc, git, npm };
        });
    }
    search(keyword, limit) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var data = yield request_1.getJson({
                url: NPM_SEARCH_URL,
                qs: {
                    text: keyword,
                    from: 0,
                    size: limit || RESULT_LIST_LIMIT_DEFAULT,
                    quality: 0,
                    popularity: 3,
                    maintenance: 0
                }
            });
            return Npm.SearchResultConvert(data.objects);
        });
    }
    install(packageName, save, dev) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const args = ['install'];
            args.push(packageName);
            if (save)
                args.push('--save');
            if (dev)
                args.push('--save-dev');
            yield npmCmd.runWithOutOutput(args);
        });
    }
    uninstall(packageName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield npmCmd.runWithOutOutput(['uninstall', packageName]);
        });
    }
}
exports.default = new Npm();
//# sourceMappingURL=npm.js.map