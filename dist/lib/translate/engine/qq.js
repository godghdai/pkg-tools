"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const request_1 = require("../../request");
const chinese_1 = require("../../util/chinese");
const headers_1 = require("../common/headers");
class QQ {
    convertToResult(json) {
        return { from: json.sourceText, to: json.targetText };
    }
    translate(keyword) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const from = Number(!chinese_1.isChinese(keyword));
            const to = Number(!from);
            var result = yield request_1.getJson({
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
                headers: headers_1.QQ_HEADERS_SIMPLE
            });
            return this.convertToResult(result);
        });
    }
}
exports.default = QQ;
//# sourceMappingURL=qq.js.map