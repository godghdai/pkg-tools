"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const table = require("tty-table");
const semver_1 = require("semver");
const git_1 = require("../../lib/git");
const npm_1 = require("../../lib/npm");
const tools = require("../../lib/tools");
const { RESULT_LIST_LIMIT_DEFAULT } = CONFIG;
exports.command = 'versions <pkgname> [range]';
exports.aliases = ['ver', 'v'];
exports.describe = 'get the package versions';
exports.builder = function (yargs) {
    return yargs
        .demand('pkgname')
        .default('pkgname', '')
        .option('limit', {
        alias: 'l',
        describe: "'result limit"
    })
        .default('limit', RESULT_LIST_LIMIT_DEFAULT)
        .option('range', {
        alias: 'r',
        describe: "'range limit"
    })
        .default('range', "*")
        .option('g', {
        alias: 'g',
        describe: "'result from git website,default from npm"
    })
        .default('g', false);
};
exports.handler = function (argv) {
    search(argv).then(res => {
        console.log(res);
        argv._callback();
    }).catch(err => { });
};
var header = [
    {
        value: "num",
        width: 10,
        color: 'white'
    }, {
        value: "version"
    }
];
function isUrl(url) {
    return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url);
}
function search(argv) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (argv.pkgname == "")
            return;
        var p = null;
        var command = argv.g
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
        var versions = yield p;
        var rows = [];
        versions.forEach((obj, index) => {
            rows.push([index, obj]);
        });
        var t1 = table(header, rows, {
            borderStyle: 2,
            headerAlign: "center",
            align: "center",
            color: "white"
        });
        return t1.render();
    });
}
//# sourceMappingURL=versions.js.map