var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const http = require('http');
const https = require('https');
const { parse } = require('url');
function get(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            var option = Object.assign({
                "headers": {
                    "user-agent": "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHT" +
                        "ML, like Gecko) Chrome/63.0.3239.84 Mobile Safari/537.36"
                }
            }, parse(url));
            (option["protocol"] == "https:"
                ? https
                : http).get(option, res => {
                if (res.statusCode !== 200) {
                    res.destroy();
                    return reject(res.statusCode);
                }
                var data = "";
                res.on('data', function (da) {
                    data += da;
                });
                res.on('end', function () {
                    resolve(data);
                });
            });
        });
    });
}
function getJson(url) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield get(url);
        try {
            data = JSON.parse(data);
            return data;
        }
        catch (err) {
            return ({});
        }
    });
}
module.exports = {
    get,
    getJson
};
//# sourceMappingURL=request.js.map