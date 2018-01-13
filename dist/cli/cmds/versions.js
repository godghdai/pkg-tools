"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("../../lib/git");
const npm_1 = require("../../lib/npm");
var Table = require('tty-table');
const semver_1 = require("semver");
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
        .default('limit', 5)
        .option('range', {
        alias: 'r',
        describe: "'range limit"
    })
        .default('range', "*")
        .default('range', "*")
        .option('g', {
        alias: 'g',
        describe: "'result from git website,default from npm"
    })
        .default('g', false);
};
exports.handler = function (argv) {
    // console.log(argv);
    if (argv.pkgname == "")
        return;
    var p = null;
    if (semver_1.validRange(argv.range)) {
        p = argv.g
            ? git_1.default.getVersionsByRange(argv.pkgname, argv.range, argv.limit)
            : npm_1.default.getVersionsByRange(argv.pkgname, argv.range, argv.limit);
    }
    else {
        p = argv.g
            ? git_1.default.getLastVersions(argv.pkgname, argv.limit)
            : npm_1.default.getLastVersions(argv.pkgname, argv.limit);
    }
    p.then(data => {
        var header = [
            {
                value: "num",
                width: 10,
                color: 'white'
            }, {
                value: "version"
            }
        ];
        var rows = [];
        data.forEach((obj, index) => {
            rows.push([index, obj]);
        });
        var t1 = Table(header, rows, {
            borderStyle: 2,
            headerAlign: "center",
            align: "center",
            color: "white"
        });
        var str1 = t1.render();
        console.log(str1);
    });
};
//# sourceMappingURL=versions.js.map