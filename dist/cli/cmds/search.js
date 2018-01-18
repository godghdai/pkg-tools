"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const table = require("tty-table");
const npm_1 = require("../../lib/npm");
const config_1 = require("../../config");
const { RESULT_LIST_LIMIT_DEFAULT } = config_1.default;
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
        .default('limit', RESULT_LIST_LIMIT_DEFAULT);
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
        var t1 = table(header, rows, {
            borderStyle: 2,
            headerAlign: "center",
            align: "center",
            color: "white"
        });
        console.log(t1.render());
        argv._callback();
    });
};
//# sourceMappingURL=search.js.map