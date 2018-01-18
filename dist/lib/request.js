"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rq = require("request-promise");
const xtend = require("xtend");
exports.UserAgent = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/63.0.3239.84 Safari/537.36'
};
function default_1(option) {
    option.headers = xtend({}, exports.UserAgent, option.headers || {});
    ;
    return rq(option);
}
exports.default = default_1;
const transform = (body, res) => JSON.parse(body);
function getJson(option) {
    option.headers = xtend({}, exports.UserAgent, option.headers || {});
    ;
    option["transform"] = transform;
    return rq(option);
}
exports.getJson = getJson;
exports.cookieJar = rq.jar;
//# sourceMappingURL=request.js.map