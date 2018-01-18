"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const npm_1 = require("./lib/npm");
const tools_1 = require("./lib/tools");
function start2() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var result = yield npm_1.default.getLastVersions('thinkjs', 5);
        console.log(JSON.stringify(result));
    });
}
tools_1.getGitUrlByPackName("think").then(a => {
    console.log(a);
}).catch(ex => {
    console.log(ex);
});
//# sourceMappingURL=test.js.map