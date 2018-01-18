"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const request_1 = require("../../request");
const fse = require("fs-extra");
const chinese_1 = require("../../util/chinese");
const encode_1 = require("./baidu/encode");
const file_store_1 = require("../../../../jslib/file-store");
const headers_1 = require("../common/headers");
const BAIDU_CONFIG_PATH = './baidu_gtk_token.config';
class Baidu {
    constructor(cookies_save_path = "baidu_cookies.json") {
        this.store = new file_store_1.FileCookieStore(cookies_save_path);
        this.cookiejar = request_1.cookieJar(this.store);
    }
    convertToResult(json) {
        var obj = json.data[0];
        return { from: obj.src, to: obj.dst };
    }
    updateCookiesAndToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var exists = yield fse.pathExists(BAIDU_CONFIG_PATH);
            var cookiejar = this.cookiejar;
            if (this.store.isExpired() || this.store.isEmpty() || !exists) {
                console.log("update...");
                yield request_1.default({ method: 'GET', uri: 'http://fanyi.baidu.com', jar: cookiejar, headers: headers_1.BAIDU_HEADERS_SIMPLE });
                var gtk_token_config = yield request_1.default({
                    jar: cookiejar,
                    uri: 'http://fanyi.baidu.com/#zh/en/%E4%B8%AD%E5%9B%BDg',
                    transform: (body, res) => {
                        return {
                            'gtk': body.match(/window.gtk = '(.*)'/)[1],
                            'token': body.match(/token: '(.*)',/)[1]
                        };
                    },
                    headers: headers_1.BAIDU_HEADERS_SIMPLE_PARMS
                });
                yield fse.writeJson(BAIDU_CONFIG_PATH, gtk_token_config);
            }
        });
    }
    translate(keyword) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.updateCookiesAndToken();
            const gtk_token_config = yield fse.readJson(BAIDU_CONFIG_PATH);
            const from = chinese_1.isChinese(keyword)
                ? "zh"
                : "en";
            const to = from == "zh"
                ? "en"
                : "zh";
            var result = yield request_1.getJson({
                method: 'POST',
                uri: 'http://fanyi.baidu.com/v2transapi',
                jar: this.cookiejar,
                form: {
                    'from': from,
                    'to': to,
                    'query': keyword,
                    //'transtype': 'realtime',
                    "transtype": 'translang',
                    'simple_means_flag': 3,
                    'sign': encode_1.n(keyword, gtk_token_config.gtk),
                    'token': gtk_token_config.token
                },
                headers: headers_1.BAIDU_HEADERS_SIMPLE_FORM
            });
            return this.convertToResult(result["trans_result"]);
        });
    }
}
exports.default = Baidu;
/*
{ from: 'zh',
to: 'en',
domain: 'all',
type: 2,
status: 0,
data:
 [ { dst: 'Computer',
     prefixWrap: 0,
     src: '电脑',
     relation: [],
     result: [Object] } ] }
 */
//# sourceMappingURL=baidu.js.map