import rp, {getJson} from './request';
import {valid, rcompare, satisfies} from 'semver';
import * as which from 'which';

import {getCmdInstance} from "./cmd";

import config from '../config';
const {NPM_REGISTRY_URL, NPM_SEARCH_URL,RESULT_LIST_LIMIT_DEFAULT} = config;

import {IQueryablePackageInfo, PackageInfo} from "./Interface/IQueryable";

function getNpmCmd() {
  var cmds = ["cnpm", "npm"];
  var index = cmds.findIndex((value, index, arr) => !!which.sync(value, {nothrow: true}));
  if (index != -1)
    return cmds[index] + (process.platform === 'win32'
      ? ".cmd"
      : "");
  }

const npmCmd = getCmdInstance(getNpmCmd());

class Npm implements IQueryablePackageInfo {

  public getPackageJson(packageName : string) {
    var res = getJson({
      url: `${NPM_REGISTRY_URL}/${packageName}`,
      headers: {
        'Host': 'registry.cnpmjs.org'
      }
    });
    return res;
  }

  private lastVersions(json : any, limit?:number) {
    return Object
      .keys(json["versions"])
      .filter(ver => valid(ver))
      .sort(rcompare)
      .slice(0, limit||RESULT_LIST_LIMIT_DEFAULT)
  }

  async getVersions(packageName : string) : Promise < string[] > {
    var outstr = await npmCmd.run(['view', packageName, 'versions', '--json']);
    var versions = JSON.parse(outstr.toString());
    return versions.filter((ver : string) => valid(ver)).sort(rcompare)
    // .slice(0, 10)
  }

  async getLastVersions(packageName : string, limit?: number) : Promise < string[] > {
    var data = await this.getPackageJson(packageName);
    return this.lastVersions(data, limit||RESULT_LIST_LIMIT_DEFAULT);
  }

  async getVersionsByRange(packageName : string, range : string, limit?: number) : Promise < string[] > {
    var vers = await this.getVersions(packageName);
    return vers
      .filter(ver => satisfies(ver, range, true))
      .slice(0, limit||RESULT_LIST_LIMIT_DEFAULT);
  }

  private static SearchResultConvert(items : any[]) : PackageInfo[] {
    return items.map < PackageInfo > (item => {
      const {
        name,
        description: desc,
        links: {
          repository: git,
          npm
        }
      } = item["package"];
      return {name, desc, git, npm};
    });
  }

  async search(keyword : string, limit?:number) : Promise < PackageInfo[] > {
    var data = await getJson({
      url: NPM_SEARCH_URL,
      qs: {
        text: keyword,
        from: 0,
        size: limit||RESULT_LIST_LIMIT_DEFAULT,
        quality: 0,
        popularity: 3,
        maintenance: 0
      }
    });
    return Npm.SearchResultConvert(data.objects);

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
}
export default new Npm();
