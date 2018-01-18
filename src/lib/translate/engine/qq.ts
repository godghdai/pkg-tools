import rp, {getJson} from '../../request';
import http = require('http');
import {ITranslate, ITranslateResult} from "../../Interface/ITranslate";
import {isChinese} from "../../util/chinese";

import {QQ_HEADERS_SIMPLE} from "../common/headers";

export default class QQ implements ITranslate {

  convertToResult(json : any) : ITranslateResult {
    return {from: json.sourceText, to: json.targetText};
  }

  async translate(keyword : string) : Promise < ITranslateResult > {
    const from = Number(!isChinese(keyword));
    const to = Number(!from);

    var result = await getJson({
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
      headers: QQ_HEADERS_SIMPLE
    });
    return this.convertToResult(result);
  }
}
