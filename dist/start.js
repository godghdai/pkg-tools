"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const npm_1 = require("./lib/npm");
function start2() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var result = yield npm_1.default.getLastVersions('thinkjs', 5);
        console.log(JSON.stringify(result));
    });
}
start2().catch(ex => {
    console.log(ex);
});
const qq_1 = require("./lib/translate/qq");
new qq_1.default().translate("中国").then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});
//# sourceMappingURL=start.js.map