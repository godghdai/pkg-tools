"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const git_1 = require("./lib/git");
function start() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var result = yield git_1.default.search('thinkjs');
        console.log(result);
    });
}
start().catch(ex => {
    console.log(ex);
});
//# sourceMappingURL=start.js.map