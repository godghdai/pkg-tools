"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const request_1 = require("./request");
const semver_1 = require("semver");
const cmd_1 = require("./cmd");
const revs_1 = require("./util/git/revs");
const { GITHUB_REPOSITORIES_URL, RESULT_LIST_LIMIT_DEFAULT } = CONFIG;
const gitCmd = cmd_1.getCmdInstance("git");
class Git {
    getVersions(remote, ref = true) {
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
    getVersionsByRange(remote, range, limit) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var vers = yield this.getVersions(remote);
            return vers
                .filter(ver => semver_1.satisfies(ver, range, true))
                .slice(0, limit || RESULT_LIST_LIMIT_DEFAULT);
        });
    }
    getLastVersions(remote, limit) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var data = yield this.getVersions(remote);
            return data.slice(0, limit || RESULT_LIST_LIMIT_DEFAULT);
        });
    }
    clone(remote, path = "") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield gitCmd.runWithOutOutput(['clone', remote]);
            return true;
        });
    }
    static SearchResultConvert(items) {
        return items.map(item => {
            const { full_name: name, description: desc, clone_url: git } = item;
            return { name, desc, git, npm: "" };
        });
    }
    search(keyword, limit, page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var data = yield request_1.getJson({
                url: GITHUB_REPOSITORIES_URL,
                qs: {
                    q: `${keyword} language:javascript`,
                    sort: "stars",
                    order: "desc",
                    per_page: limit || RESULT_LIST_LIMIT_DEFAULT,
                    page: page || 1
                }
            });
            return Git.SearchResultConvert(data.items);
        });
    }
}
exports.default = new Git();
//# sourceMappingURL=git.js.map