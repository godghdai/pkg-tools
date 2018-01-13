import * as _ from 'lodash';
import * as rp from 'request-promise';
import {valid, rcompare, satisfies} from 'semver';

import {getCmdInstance} from "./cmd";
import {revsParse} from "./util/git/revs";
import {urlParse} from "./util/git/url";

import {DEFAULT_HTTP_HEADER, GITHUB_REPOSITORIES_URL} from "./common/constant";

import {IQueryablePackageInfo, PackageInfo} from "./Interface/IQueryable";

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

  async getVersionsByRange(remote : string, range : string,limit:number=5) : Promise < string[] > {
    var vers = await this.getVersions(remote);
    return vers.filter(ver => satisfies(ver, range, true)).slice(0, limit);
  }

  async getLastVersions(remote : string, limit : number = 10) {
    var data = await this.getVersions(remote);
    return data.slice(0, limit);
  }

  async clone(remote : string, path : string = "") : Promise < boolean > {
    await gitCmd.runWithOutOutput(['clone', remote, path]);
    return true;
  }

  private static SearchResultConvert(items : any[]) : PackageInfo[] {
    //_.pick(el, ["name", "full_name", "description", "clone_url", "homepage"]);
    return items.map < PackageInfo > (item => {
      let npm = "";
      const {full_name: name, description: desc, clone_url: git} = item;
      return {name, desc, git, npm};
    });
  }

  async search(keyword : string, limit = 2) : Promise < PackageInfo[] > {
    var data = await rp({
      url: GITHUB_REPOSITORIES_URL,
      headers: DEFAULT_HTTP_HEADER,
      qs: {
        q: `${keyword} language:javascript`,
        sort: "stars",
        order: "desc",
        per_page: limit,
        page: 1
      },
      transform: (body, res) => JSON.parse(body)
    });
    return Git.SearchResultConvert(data.items);
  }
}

export default new Git();
