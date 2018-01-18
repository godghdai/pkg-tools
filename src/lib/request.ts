import * as rq from 'request-promise';
import * as http from 'http';
import * as xtend from 'xtend';
export const UserAgent = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/63.0.3239.84 Safari/537.36'
}

export default function (option : rq.Options) {
  option.headers = xtend({}, UserAgent, option.headers || {});;
  return rq(option);
}

const transform = (body : any, res : http.IncomingMessage) => JSON.parse(body);
export function getJson(option : rq.Options) {
  option.headers = xtend({}, UserAgent, option.headers || {});;
  option["transform"] = transform;
  return rq(option);
}

export const cookieJar=rq.jar
