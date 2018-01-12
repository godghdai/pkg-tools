"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rp = require("request-promise");
const chinese_1 = require("../util/chinese");
const HEADERS_SIMPLE = {
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': 'm.fanyi.qq.com',
    'Origin': 'http://m.fanyi.qq.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/63.0.3239.84 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
};
class Youdao {
    convertToResult(json) {
        return { from: json.sourceText, to: json.targetText };
    }
    translate(keyword) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const from = Number(!chinese_1.isChinese(keyword));
            const to = Number(!from);
            var result = yield rp({
                method: 'POST',
                uri: 'http://m.fanyi.qq.com/translate',
                form: {
                    'sourceText': keyword,
                    from,
                    to,
                    'type': 1,
                    'latitude': 1,
                    'longitude': 1,
                    'platform': 'H5'
                },
                headers: HEADERS_SIMPLE,
                transform: (body, res) => JSON.parse(body)
            });
            return this.convertToResult(result);
        });
    }
}
exports.default = Youdao;
//# sourceMappingURL=qq.js.map