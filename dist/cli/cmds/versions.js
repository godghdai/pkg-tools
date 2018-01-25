"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const table = require("tty-table");
const semver_1 = require("semver");
const git_1 = require("../../lib/git");
const npm_1 = require("../../lib/npm");
const tools = require("../../lib/tools");
const { RESULT_LIST_LIMIT_DEFAULT } = CONFIG;
const isUrl = (url) => /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url);
exports.command = 'versions <pkgname> [range]';
exports.aliases = ['ver', 'v'];
exports.describe = '查询包的版本';
exports.builder = function (yargs) {
    return yargs
        .demand('pkgname')
        .default('pkgname', '')
        .option('limit', {
        alias: 'l',
        describe: "'返回的条目数"
    })
        .default('limit', RESULT_LIST_LIMIT_DEFAULT)
        .option('range', {
        alias: 'r',
        describe: "根据条件(semver range)过滤版本列表"
    })
        .default('range', "*")
        .option('g', {
        alias: 'g',
        describe: "从github获取版本，默认从npm"
    })
        .default('g', false);
};
exports.handler = function (argv) {
    search(argv).then(res => {
        console.log(res);
        argv._commandComplete({ type: "versions" });
    }).catch(err => { });
};
function search(argv) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (argv.pkgname == "")
            return;
        var p = null, command = argv.g
            ? git_1.default
            : npm_1.default;
        if (argv.g) {
            if (!isUrl(argv.pkgname))
                argv.pkgname = yield tools.getGitUrlByPackName(argv.pkgname);
        }
        if (semver_1.validRange(argv.range)) {
            p = command.getVersionsByRange(argv.pkgname, argv.range, argv.limit);
        }
        else {
            p = command.getLastVersions(argv.pkgname, argv.limit);
        }
        var versions = yield p, rows = [];
        versions.forEach((obj, index) => {
            rows.push([index, obj]);
        });
        return table([
            {
                value: "num",
                width: 10,
                color: 'white'
            }, {
                value: "version"
            }
        ], rows, {
            borderStyle: 2,
            headerAlign: "center",
            align: "center",
            color: "white"
        }).render();
    });
}
//# sourceMappingURL=versions.js.map