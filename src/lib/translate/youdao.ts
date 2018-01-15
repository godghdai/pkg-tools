import * as rp from 'request-promise';
import http = require('http');
import * as request from 'request';
import {md5} from '../../../jslib/md5';
import {FileCookieStore} from '../../../jslib/file-store';

import {ITranslate, ITranslateResult} from "../Interface/ITranslate";

import {YOUDAO_HEADERS_SIMPLE,YOUDAO_HEADERS_FORM} from "./common/headers";

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
      await rp({method: 'GET', uri: 'http://fanyi.youdao.com/', jar: cookiejar, headers: YOUDAO_HEADERS_SIMPLE});
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
      headers: YOUDAO_HEADERS_FORM,
      transform: (body : any, res : http.IncomingMessage) => JSON.parse(body)
    });
    return this.convertToResult(result["translateResult"]);
  }
}


