"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readMetadata = require("read-metadata");
const path = require("path");
exports.default = {
    load() {
        let config = readMetadata.sync(path.join(__dirname, "../config.yml"));
        config['COOKIES_SAVE_PATH_DEFAULT'] = path.join(__dirname, config['COOKIES_SAVE_PATH_DEFAULT']);
        global.CONFIG = config;
        return config;
    }
};
//# sourceMappingURL=config.js.map