"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const npm_1 = require("../../lib/npm");
var Table = require('tty-table');
exports.command = 'search <pkgname>';
exports.aliases = ['s'];
exports.describe = 'search package name';
exports.builder = function (yargs) {
    return yargs
        .demand('pkgname')
        .default('pkgname', '')
        .option('limit', {
        alias: 'l',
        describe: "'result limit"
    })
        .default('limit', 2);
};
exports.handler = function (argv) {
    if (argv.pkgname == "")
        return;
    npm_1.default
        .search(argv.pkgname, argv.limit)
        .then(data2 => {
        var header = [
            {
                value: "name"
            }, {
                value: "desc"
            }, {
                value: "git"
            }, {
                value: "npm"
            }
        ];
        var rows = [];
        data2.forEach(obj => {
            rows.push([obj.name, obj.desc, obj.git, obj.npm]);
        });
        var t1 = Table(header, rows, {
            borderStyle: 2,
            headerAlign: "center",
            align: "center",
            color: "white"
        });
        var str1 = t1.render();
        console.log(str1);
        argv._callback();
    });
};
//# sourceMappingURL=search.js.map