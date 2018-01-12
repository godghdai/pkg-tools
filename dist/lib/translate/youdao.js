"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rp = require("request-promise");
const xtend = require("xtend");
const md5_1 = require("./md5");
const file_store_1 = require("./file-store");
const HEADERS_SIMPLE = {
    'Host': 'fanyi.youdao.com',
    'Origin': 'http://fanyi.youdao.com',
    'Referer': 'http://fanyi.youdao.com/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/63.0.3239.84 Safari/537.36'
};
const HEADERS_FORM = xtend({
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest'
}, HEADERS_SIMPLE);
class Youdao {
    constructor(cookies_save_path = "youdao_cookies.json") {
        this.store = new file_store_1.FileCookieStore(cookies_save_path);
        this.cookiejar = rp.jar(this.store);
    }
    static getSaltSign(keyword) {
        var salt = "" + ((new Date).getTime() + parseInt((10 * Math.random()).toString(), 10));
        return {
            salt,
            sign: md5_1.md5(Youdao.KEY + keyword + salt + Youdao.VALUE)
        };
    }
    convertToResult(json) {
        // [ [ { tgt: 'The test was Beijing', src: '测试本来京' } ] ]
        var obj = json[0][0];
        return { from: obj.src, to: obj.tgt };
    }
    translate(keyword) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var cookiejar = this.cookiejar;
            if (this.store.isExpired() || this.store.isEmpty()) {
                yield rp({ method: 'GET', uri: 'http://fanyi.youdao.com/', jar: cookiejar, headers: HEADERS_SIMPLE });
            }
            var { salt, sign } = Youdao.getSaltSign(keyword);
            var result = yield rp({
                method: 'POST',
                uri: 'http://fanyi.youdao.com/translate_o',
                jar: cookiejar,
                qs: {
                    "smartresult": ['dict', "rule"]
                },
                form: {
                    'i': keyword,
                    'from': 'AUTO',
                    'to': 'AUTO',
                    'smartresult': 'dict',
                    'client': 'fanyideskweb',
                    'salt': salt,
                    'sign': sign,
                    'doctype': 'json',
                    'version': '2.1',
                    'keyfrom': 'fanyi.web',
                    'action': 'FY_BY_CLICKBUTTION',
                    'typoResult': false
                },
                headers: HEADERS_FORM,
                transform: (body, res) => JSON.parse(body)
            });
            return this.convertToResult(result["translateResult"]);
        });
    }
}
Youdao.KEY = "fanyideskweb";
Youdao.VALUE = "rY0D^0'nM0}g5Mm1z%1G4";
exports.default = Youdao;
//# sourceMappingURL=youdao.js.map