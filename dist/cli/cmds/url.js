"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("../../lib/tools");
exports.command = 'url <packname>';
exports.aliases = ['u'];
exports.describe = 'get packname git url';
exports.builder = function (yargs) { };
exports.handler = function (argv) {
    if (argv.pkgname == "")
        return;
    tools_1.getGitUrlByPackName(argv.packname).then(a => {
        console.log(a);
        argv._commandComplete();
    }).catch(ex => {
        console.log(ex);
        argv._commandComplete();
    });
};
//# sourceMappingURL=url.js.map