import * as rp from 'request-promise';
import http = require('http');
import * as request from 'request';
import * as xtend from 'xtend';
import {md5} from './md5';
import {FileCookieStore} from './file-store';

import {ITranslate, ITranslateResult} from "../Interface/ITranslate";

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


export default class Youdao implements ITranslate {

  static KEY:string = "fanyideskweb";
  static VALUE:string = "rY0D^0'nM0}g5Mm1z%1G4";
  private store : FileCookieStore;
  private cookiejar:request.CookieJar;

  constructor(cookies_save_path:string="youdao_cookies.json"){

    this.store  = new FileCookieStore(cookies_save_path);
    this.cookiejar = rp.jar(this.store );
  }

  static getSaltSign(keyword : string) {
    var salt = "" + ((new Date).getTime() + parseInt((10 * Math.random()).toString(), 10));
    return {
      salt,
      sign: md5(Youdao.KEY + keyword + salt + Youdao.VALUE)
    }
  }

   convertToResult(json:any) : ITranslateResult {
    // [ [ { tgt: 'The test was Beijing', src: '测试本来京' } ] ]
    var obj = json[0][0];
    return {from: obj.src, to: obj.tgt};
  }

  async translate(keyword : string) : Promise < ITranslateResult > {

    var cookiejar=this.cookiejar;
    if(this.store.isExpired() || this.store.isEmpty()) {
      await rp({method: 'GET', uri: 'http://fanyi.youdao.com/', jar: cookiejar, headers: HEADERS_SIMPLE});
    }

    var {salt, sign} = Youdao.getSaltSign(keyword);
    var result = await rp({
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
      transform: (body : any, res : http.IncomingMessage) => JSON.parse(body)
    });
    return this.convertToResult(result["translateResult"]);
  }
}


