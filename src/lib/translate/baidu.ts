import * as rp from 'request-promise';
import http = require('http');
import * as request from 'request';
import * as fse from 'fs-extra';
import debug from 'debug';

import {isChinese} from "../util/chinese";
import {n as encode} from './baidu/encode';
import {FileCookieStore} from './file-store';

import {ITranslate, ITranslateResult} from "../Interface/ITranslate";

import {BAIDU_HEADERS_SIMPLE, BAIDU_HEADERS_SIMPLE_PARMS, BAIDU_HEADERS_SIMPLE_FORM} from "./common/headers";

const BAIDU_CONFIG_PATH = './baidu_gtk_token.config';

export default class Baidu implements ITranslate {
  private store : FileCookieStore;
  private cookiejar : request.CookieJar;

  constructor(cookies_save_path : string = "baidu_cookies.json") {

    this.store = new FileCookieStore(cookies_save_path);
    this.cookiejar = rp.jar(this.store);
  }

  convertToResult(json : any) : ITranslateResult {
    var obj = json.data[0];
    return {from: obj.src, to: obj.dst};
  }

  async updateCookiesAndToken() {
    var exists = await fse.pathExists(BAIDU_CONFIG_PATH);
    var cookiejar = this.cookiejar;
    if (this.store.isExpired() || this.store.isEmpty() || !exists) {
      console.log("update...");
      await rp({method: 'GET', uri: 'http://fanyi.baidu.com', jar: cookiejar, headers: BAIDU_HEADERS_SIMPLE});
      var gtk_token_config = await rp({
        method: 'GET',
        jar: cookiejar,
        uri: 'http://fanyi.baidu.com/#zh/en/%E4%B8%AD%E5%9B%BDg',
        transform:(body : any, res : http.IncomingMessage)=>{
          return {
            'gtk': body.match(/window.gtk = '(.*)'/)[1],
            'token': body.match(/token: '(.*)',/)[1]
          }
        },
        headers: BAIDU_HEADERS_SIMPLE_PARMS
      });
      await fse.writeJson(BAIDU_CONFIG_PATH, gtk_token_config);
    }
  }

  async translate(keyword : string) : Promise < ITranslateResult > {
    await this.updateCookiesAndToken();
    const gtk_token_config = await fse.readJson(BAIDU_CONFIG_PATH);
    const from = isChinese(keyword)
      ? "zh"
      : "en";
    const to = from == "zh"
      ? "en"
      : "zh";

    var result = await rp({
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
        'sign': encode(keyword, gtk_token_config.gtk),
        'token': gtk_token_config.token
      },
      headers: BAIDU_HEADERS_SIMPLE_FORM,
      transform:  (body : any, res : http.IncomingMessage)=>JSON.parse(body)
    });
    return this.convertToResult(result["trans_result"]);

  }
}

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
