"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cmd_1 = require("./cmd");
const rp = require("request-promise");
const revs_1 = require("./git_util/revs");
const semver_1 = require("semver");
const constant_1 = require("./common/constant");
const gitCmd = cmd_1.getCmdInstance("git");
exports.default = new class {
    versions(remote, ref = true) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var outstr = yield gitCmd.run(['ls-remote', '-h', '-t', remote]);
            var { versions } = revs_1.revsParse(outstr.toString());
            return Object
                .keys(versions)
                .filter(ver => semver_1.valid(ver))
                .sort(semver_1.rcompare)
                .map(ver => ref
                ? versions[ver].ref
                : ver);
        });
    }
    clone(remote, path = "") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield gitCmd.runWithOutOutput(['clone', remote, path]);
            return true;
        });
    }
    search(keyword) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var data = yield rp({
                url: constant_1.GITHUB_REPOSITORIES_URL,
                headers: constant_1.DEFAULT_HTTP_HEADER,
                qs: {
                    q: `${keyword} language:javascript`,
                    sort: "stars",
                    order: "desc",
                    per_page: 2,
                    page: 1
                },
                transform: function (body, res) {
                    return JSON.parse(body);
                }
            });
            return data
                .items
                .map(function (el) {
                return { name: el.name, full_name: el.full_name, description: el.description, clone_url: el.clone_url, homepage: el.homepage };
            });
        });
    }
};
//# sourceMappingURL=git.js.map