import {getCmdInstance} from "./cmd";
import * as rp from 'request-promise';
import {revsParse} from "./git_util/revs";
import {urlParse} from "./git_util/url";
import {valid, rcompare} from 'semver';
import {DEFAULT_HTTP_HEADER,GITHUB_REPOSITORIES_URL} from "./common/constant";

const gitCmd = getCmdInstance("git");

interface repositorie {
  name: string,
  full_name: string,
  description: string,
  clone_url: string,
  homepage: string
}

export default new class {
  async versions(remote : string, ref = true) : Promise < string[] > {
    var outstr = await gitCmd.run(['ls-remote', '-h', '-t', remote]);
    var {versions} = revsParse(outstr.toString());
    return Object
      .keys(versions)
      .filter(ver => valid(ver))
      .sort(rcompare)
      //.slice(0, limit)
      .map(ver => ref
        ? versions[ver].ref
        : ver);
  }

  async clone(remote : string, path: string = "") :  Promise < boolean> {
    await gitCmd.runWithOutOutput(['clone',remote,path]);
    return true;
  }

  async search(keyword : string) {
    var data = await rp({
      url: GITHUB_REPOSITORIES_URL,
      headers: DEFAULT_HTTP_HEADER,
      qs: {
        q: `${keyword} language:javascript`,
        sort: "stars",
        order: "desc",
        per_page: 2,
        page: 1
      },
      transform: function (body, res) {
        return JSON.parse(body);
      }
    })
    return data
      .items
      .map(function (el :repositorie) {
        return {name: el.name, full_name: el.full_name, description: el.description, clone_url: el.clone_url, homepage: el.homepage}
      });
  }
}
