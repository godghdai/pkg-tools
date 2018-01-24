import * as _ from 'lodash';
import {getJson} from './request';
import {valid, rcompare, satisfies} from 'semver';
import {getCmdInstance} from "./cmd";
import {revsParse} from "./util/git/revs";
import {urlParse} from "./util/git/url";
import {IQueryablePackageInfo, PackageInfo} from "./Interface/IQueryable";
const {GITHUB_REPOSITORIES_URL, RESULT_LIST_LIMIT_DEFAULT} = CONFIG;

const gitCmd = getCmdInstance("git");

class Git implements IQueryablePackageInfo {
  async getVersions(remote : string, ref = true) : Promise < string[] > {
    var outstr = await gitCmd.run(['ls-remote', '-h', '-t', remote]);
    var {versions} = revsParse(outstr.toString());
    return Object
      .keys(versions)
      .filter(ver => valid(ver))
      .sort(rcompare)
      .map(ver => ref
        ? versions[ver].ref
        : ver);
  }

  async getVersionsByRange(remote : string, range : string, limit?: number) : Promise < string[] > {
    var vers = await this.getVersions(remote);
    return vers
      .filter(ver => satisfies(ver, range, true))
      .slice(0, limit || RESULT_LIST_LIMIT_DEFAULT);
  }

  async getLastVersions(remote : string, limit?: number) {
    var data = await this.getVersions(remote);
    return data.slice(0, limit || RESULT_LIST_LIMIT_DEFAULT);
  }

  async clone(remote : string, path : string = "") : Promise < boolean > {
    await gitCmd.runWithOutOutput(['clone', remote]);
    return true;
  }

  private static SearchResultConvert(items : any[]) : PackageInfo[] {
    return items.map < PackageInfo > (item => {
      const {full_name: name, description: desc, clone_url: git} = item;
      return {name, desc, git, npm: ""};
    });
  }

  async search(keyword : string,limit?: number,page?: number) : Promise < PackageInfo[] > {
    var data = await getJson({
      url: GITHUB_REPOSITORIES_URL,
      qs: {
        q: `${keyword} language:javascript`,
        sort: "stars",
        order: "desc",
        per_page: limit || RESULT_LIST_LIMIT_DEFAULT,
        page: page || 1
      }
    });
    return Git.SearchResultConvert(data.items);
  }
}

export default new Git();
