import * as rp from 'request-promise';
import {Cookie,CookieJar} from 'tough-cookie';
import http = require('http');
import * as request from 'request';
import {md5} from './md5';
import {FileCookieStore}  from './file-store';

var E = "fanyideskweb",
  O = "rY0D^0'nM0}g5Mm1z%1G4";

function parseCookie(res : http.IncomingMessage) {
  var cookies = res.headers["set-cookie"];
  if (!Array.isArray(cookies)) {
    cookies = [cookies];
  }

  return cookies.map((cookie : string) => Cookie.parse(cookie)).reduce((result, el) => {
    result[el.key] = el;
    return result;
  }, {} as {[key:string]:Cookie});
}

export async function start(keyword:string) {

  var salt = "" + ((new Date).getTime() + parseInt((10 * Math.random()).toString(), 10));
  var sign = md5(E + keyword + salt + O);

  const store:FileCookieStore = new FileCookieStore('./cookie.json');
  var cookiejar = new CookieJar(store);

  if (store.isExpired() || store.isEmpty()) {
    console.log("isExpired")
    await rp({
      method: 'GET',
      uri: 'http://fanyi.youdao.com/',
      jar: cookiejar,
      headers: {
        'Host': 'fanyi.youdao.com',
        'Origin': 'http://fanyi.youdao.com',
        'Referer': 'http://fanyi.youdao.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
            'Chrome/63.0.3239.84 Safari/537.36'
      },
      transform: function (body, res) {
        var cookie = parseCookie(res)["OUTFOX_SEARCH_USER_ID"];
        cookiejar.setCookieSync(cookie, "http://fanyi.youdao.com");
        return res;
      }
    });
  }

  var options = {
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
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Host': 'fanyi.youdao.com',
      'Origin': 'http://fanyi.youdao.com',
      'Referer': 'http://fanyi.youdao.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/63.0.3239.84 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest'
    },
    transform: function (body:any, res:http.IncomingMessage) {
      return JSON.parse(body);
    }
  };
  var result = await rp(options);
  console.log(result["translateResult"]);
}

