import {getCmdInstance} from "./cmd";
import * as rp from 'request-promise';
import {valid, rcompare} from 'semver';
import * as which from 'which';
import {DEFAULT_HTTP_HEADER, NPM_REGISTRY_URL, NPM_SEARCH_URL} from "./common/constant";

function getNpmCmd() {
  var cmds = ["cnpm", "npm"];
  var index = cmds.findIndex((value, index, arr) => which.sync(value, {nothrow: true}));
  if (index != -1)
    return cmds[index] + (process.platform === 'win32'
      ? ".cmd"
      : "");
  }

const npmCmd = getCmdInstance(getNpmCmd());

export default new class {

  pkgJson(packageName : string) {
    var res = rp.get(`${NPM_REGISTRY_URL}/${packageName}`, {
      transform: function (body, res) {
        return JSON.parse(body);
      }
    });
    return res;
  }

  lastVersions(json : any, limit = 10) {
    return Object
      .keys(json["versions"])
      .filter(ver => valid(ver))
      .sort(rcompare)
      .slice(0, limit)
  }

  async versions(packageName : string, limit : number = 10) {
    var data = await this.pkgJson(packageName);
    return this.lastVersions(data, limit);
  }

  async install(packageName : string, save : boolean, dev : boolean) {
    const args = ['install'];
    args.push(packageName)
    if (save)
      args.push('--save')
    if (dev)
      args.push('--save-dev')
    await npmCmd.runWithOutOutput(args);

  }

  async uninstall(packageName : string) {
    await npmCmd.runWithOutOutput(['uninstall', packageName]);
  }

  async versions2(packageName : string) : Promise < string[] > {
    var outstr = await npmCmd.run(['view', packageName, 'versions', '--json']);
    var versions = JSON.parse(outstr.toString());
    return versions
      .filter(ver => valid(ver))
      .sort(rcompare)
      .slice(0, 10)
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
