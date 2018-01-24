"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const table = require("tty-table");
const git_1 = require("../../lib/git");
const npm_1 = require("../../lib/npm");
const translate_1 = require("../../lib/translate");
const { RESULT_LIST_LIMIT_DEFAULT, TRANSLATE_ENGINE_SELECT_DEFAULT } = CONFIG;
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
        .default('limit', RESULT_LIST_LIMIT_DEFAULT)
        .option('g', {
        alias: 'g',
        describe: "'result from git website,default from npm"
    })
        .default('g', false)
        .option('page', {
        alias: 'p',
        describe: "'page index"
    })
        .default('page', 1)
        .option('trans', {
        alias: 't',
        describe: "'translate the pkgname"
    })
        .default('t', false);
};
const header = [
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
exports.handler = function (argv) {
    return search(argv);
};
function search(argv) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (argv.pkgname == "")
            return;
        var command = argv.g
            ? git_1.default
            : npm_1.default;
        var page = argv.g
            ? argv.page
            : argv.page - 1;
        if (argv.trans) {
            const { to } = yield translate_1.translate(argv.pkgname, TRANSLATE_ENGINE_SELECT_DEFAULT.charAt(0));
            argv.pkgname = to;
        }
        command
            .search(argv.pkgname, argv.limit, page)
            .then((data2) => {
            var rows = [];
            data2.forEach((obj) => {
                rows.push([obj.name, obj.desc, obj.git, obj.npm]);
            });
            var t1 = table(header, rows, {
                borderStyle: 2,
                headerAlign: "center",
                align: "center",
                color: "white"
            });
            argv._commandComplete({
                type: "search",
                argv,
                handler: exports.handler,
                playload: t1.render()
            });
        });
    });
}
//# sourceMappingURL=search.js.map