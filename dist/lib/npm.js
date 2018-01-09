"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cmd_1 = require("./cmd");
const rp = require("request-promise");
const semver_1 = require("semver");
const npmCmd = cmd_1.getCmdInstance("npm");
const constant_1 = require("./common/constant");
exports.default = new class {
    getPkgJson(packageName) {
        return rp.get(`${constant_1.NPM_REGISTRY_URL}/${packageName}`);
    }
    getLastVersions(json, limit = 10) {
        return Object
            .keys(json["versions"])
            .filter(ver => semver_1.valid(ver))
            .sort(semver_1.rcompare)
            .slice(0, limit);
    }
    versions(packageName, limit = 10) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var data = yield this.getPkgJson(packageName);
            return this.getLastVersions(data, limit);
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