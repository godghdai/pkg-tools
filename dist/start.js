"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const npm_1 = require("./lib/npm");
function start() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var result = yield npm_1.default.versions2('thinkjs');
        console.log(result);
    });
}
start().catch(ex => {
    console.log(ex);
});
//# sourceMappingURL=start.js.map