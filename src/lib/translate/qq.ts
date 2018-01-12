import * as rp from 'request-promise';
import http = require('http');
import {ITranslate, ITranslateResult} from "../Interface/ITranslate";
import {isChinese} from "../util/chinese";

const HEADERS_SIMPLE = {
  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Host': 'm.fanyi.qq.com',
  'Origin': 'http://m.fanyi.qq.com',
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/63.0.3239.84 Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest'
};

export default class Youdao implements ITranslate {

  convertToResult(json : any) : ITranslateResult {
    return {from: json.sourceText, to: json.targetText};
  }

  async translate(keyword : string) : Promise < ITranslateResult > {
    const from = Number(!isChinese(keyword));
    const to = Number(!from);

    var result = await rp({
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
      headers:HEADERS_SIMPLE,
      transform: (body : any, res : http.IncomingMessage) => JSON.parse(body)
    });
    return this.convertToResult(result);
  }
}
