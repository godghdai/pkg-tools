/**!
 * giturl - lib/giturl.js
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */
// host[:/]n1/n2

import {Iprop} from '../../Interface/ICommon';

var RE = /^([^:\/]+)[:\/](.+)$/i;

var HTTPS_HOSTS : Iprop < number > = {
  'github.com': 1,
  'gitcafe.com': 1,
  'gist.github.com': 1
};

export function urlParse(sourceURL : string) {
  if (!sourceURL || typeof sourceURL !== 'string') {
    return '';
  }
  var url = sourceURL;
  if (url.indexOf('@') >= 0) {
    url = url.replace(/^[^@]+@/, ''); // `git@`` || `https://jpillora@` => ""
  }
  url = url.replace(/^[\w+]+:\/\//, '') // `git://` || `git+https://` => ""
    .replace(/\.git$/, ''); // .git => ""
  var item = RE.exec(url);
  if (!item) {
    return sourceURL;
  }

  var host = item[1];
  var protocol = HTTPS_HOSTS[host]
    ? 'https'
    : 'http';

  // p1/p2/.../pn[.xxx]
  var url = item[2]
    .split('/', 2)
    .join('/');
  return protocol + '://' + host + '/' + url;
}
