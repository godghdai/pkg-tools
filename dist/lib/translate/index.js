"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baidu_1 = require("./baidu");
const qq_1 = require("./qq");
const youdao_1 = require("./youdao");
const fullnames = ["baidu", "qq", "youdao"];
function getFullName(engine) {
    var index = fullnames.findIndex(name => {
        return name.charAt(0) == engine;
    });
    if (index != -1)
        return fullnames[index];
    return "youdao";
}
const EngineInstances = {
    'baidu': new baidu_1.default(),
    'qq': new qq_1.default(),
    'youdao': new youdao_1.default()
};
function getEngineInstance(engine) {
    var translate = null;
    return EngineInstances[getFullName(engine)];
}
exports.getEngineInstance = getEngineInstance;
//# sourceMappingURL=index.js.map