"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rp = require("request-promise");
const semver_1 = require("semver");
const cmd_1 = require("./cmd");
const revs_1 = require("./git_util/revs");
const constant_1 = require("./common/constant");
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
    getVersionsByRange(remote, range) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var vers = yield this.getVersions(remote);
            return vers.filter(ver => semver_1.satisfies(ver, range, true));
        });
    }
    getLastVersions(remote, limit = 10) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var data = yield this.getVersions(remote);
            return data.slice(0, limit);
        });
    }
    clone(remote, path = "") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield gitCmd.runWithOutOutput(['clone', remote, path]);
            return true;
        });
    }
    static SearchResultConvert(items) {
        //_.pick(el, ["name", "full_name", "description", "clone_url", "homepage"]);
        return items.map(item => {
            let npm = "";
            const { full_name: name, description: desc, clone_url: git } = item;
            return { name, desc, git, npm };
        });
    }
    search(keyword, limit = 2) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var data = yield rp({
                url: constant_1.GITHUB_REPOSITORIES_URL,
                headers: constant_1.DEFAULT_HTTP_HEADER,
                qs: {
                    q: `${keyword} language:javascript`,
                    sort: "stars",
                    order: "desc",
                    per_page: limit,
                    page: 1
                },
                transform: (body, res) => JSON.parse(body)
            });
            return Git.SearchResultConvert(data.items);
        });
    }
}
exports.default = new Git();
//# sourceMappingURL=git.js.map