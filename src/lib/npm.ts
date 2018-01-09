import {getCmdInstance} from "./cmd";
import * as rp from 'request-promise';
import {valid, rcompare} from 'semver';
const npmCmd = getCmdInstance("npm");
import {DEFAULT_HTTP_HEADER, NPM_REGISTRY_URL, NPM_SEARCH_URL} from "./common/constant";

export default new class {

  getPkgJson(packageName : string) {
    return rp.get(`${NPM_REGISTRY_URL}/${packageName}`);
  }

  getLastVersions(json : any, limit = 10) {
    return Object
      .keys(json["versions"])
      .filter(ver => valid(ver))
      .sort(rcompare)
      .slice(0, limit)
  }

  async versions(packageName : string, limit : number = 10) {
    var data = await this.getPkgJson(packageName);
    return this.getLastVersions(data, limit);
  }

  async search(keyword : string, size = 2) {
    var data = await rp({
      url: NPM_SEARCH_URL,
      headers: DEFAULT_HTTP_HEADER,
      qs: {
        text: keyword,
        from: 0,
        size,
        quality: 0,
        popularity: 3,
        maintenance: 0
      },
      transform: function (body, res) {
        return JSON.parse(body);
      }
    });
    return data.objects;

  }
}
