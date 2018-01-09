"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cmd_1 = require("./cmd");
const rp = require("request-promise");
const semver_1 = require("semver");
const which = require("which");
const constant_1 = require("./common/constant");
function getNpmCmd() {
    var cmds = ["cnpm", "npm"];
    var index = cmds.findIndex((value, index, arr) => which.sync(value, { nothrow: true }));
    if (index != -1)
        return cmds[index] + (process.platform === 'win32'
            ? ".cmd"
            : "");
}
const npmCmd = cmd_1.getCmdInstance(getNpmCmd());
exports.default = new class {
    pkgJson(packageName) {
        var res = rp.get(`${constant_1.NPM_REGISTRY_URL}/${packageName}`, {
            transform: function (body, res) {
                return JSON.parse(body);
            }
        });
        return res;
    }
    lastVersions(json, limit = 10) {
        return Object
            .keys(json["versions"])
            .filter(ver => semver_1.valid(ver))
            .sort(semver_1.rcompare)
            .slice(0, limit);
    }
    versions(packageName, limit = 10) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var data = yield this.pkgJson(packageName);
            return this.lastVersions(data, limit);
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
    versions2(packageName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var outstr = yield npmCmd.run(['view', packageName, 'versions', '--json']);
            var versions = JSON.parse(outstr.toString());
            return versions
                .filter(ver => semver_1.valid(ver))
                .sort(semver_1.rcompare)
                .slice(0, 10);
        });
    }
    search(keyword, size = 2) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var data = yield rp({
                url: constant_1.NPM_SEARCH_URL,
                headers: constant_1.DEFAULT_HTTP_HEADER,
                qs: {
                    text: keyword,
                    from: 0,
                    size,
                    quality: 0,
                    popularity: 3,
                    maintenance: 0
                },
                transform: function (body, res) {
                    return JSON.parse(body);
                }
            });
            return data.objects;
        });
    }
};
//# sourceMappingURL=npm.js.map