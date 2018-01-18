"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readMetadata = require("read-metadata");
const path = require("path");
const config = (function () {
    return readMetadata.sync(path.join(__dirname, "../config.yml"));
})();
exports.default = config;
//# sourceMappingURL=config.js.map