import * as xtend from 'xtend';
export const UserAgent = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/63.0.3239.84 Safari/537.36'
}

export const Form = {
  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'X-Requested-With': 'XMLHttpRequest'
}

export const QQ_HEADERS_SIMPLE = xtend({
  'Host': 'm.fanyi.qq.com',
  'Origin': 'http://m.fanyi.qq.com'
}, UserAgent, Form);


export const YOUDAO_HEADERS_SIMPLE = xtend({
  'Host': 'fanyi.youdao.com',
  'Origin': 'http://fanyi.youdao.com',
  'Referer': 'http://fanyi.youdao.com/'
}, UserAgent);

export const YOUDAO_HEADERS_FORM = xtend({}, YOUDAO_HEADERS_SIMPLE, Form);

