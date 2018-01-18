"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = require("../../config");
const { TRANSLATE_ENGINES, TRANSLATE_ENGINE_SELECT_DEFAULT } = config_1.default;

function getFullName(engine) {
    var index = TRANSLATE_ENGINES.findIndex(name => name.charAt(0) == engine);
    if (index != -1)
        return TRANSLATE_ENGINES[index];
    return TRANSLATE_ENGINE_SELECT_DEFAULT;
}
let EngineInstances = new Map();

function getEngineInstance(engine) {
    let fullname = getFullName(engine);
    console.log(engine, fullname);
    if (!EngineInstances.has(fullname)) {
        let cls = require(`./engine/${fullname}`).default;
        EngineInstances.set(fullname, new cls());
    }
    return EngineInstances.get(fullname);
}
exports.getEngineInstance = getEngineInstance;

function translate(word, engine) {
    return tslib_1.__awaiter(this, void 0, void 0, function*() {
        return getEngineInstance(engine).translate(word);
    });
}
exports.translate = translate;
//# sourceMappingURL=index.js.map