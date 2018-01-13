import git from "./git";
import npm from "./npm";
import {urlParse} from "./util/git/url";
import {PackageInfo} from "./Interface/IQueryable";
import chalk from 'chalk';

export async function getGitUrlByPackName(packname : string) : Promise < string > {
  var result = await npm
    .getPackageJson(packname)
    .catch(ex => Promise.resolve(null));

  if (result != null) {
    const {type,url}=result.repository;
    if(type=="git"&&url!="")
    return urlParse(url);
  }

  var packageInfos: PackageInfo[];

  console.log(chalk.grey(`search ${chalk.yellow(packname)} from npm....`));
  packageInfos = await npm
    .search(packname)
    .catch(ex => Promise.resolve(null));

  if (packageInfos != null && packageInfos.length > 0) {
    return packageInfos[0].git;
  }

  console.log(chalk.grey(`search ${chalk.yellow(packname)} from git....`));
  packageInfos = await git
    .search(packname)
    .catch(ex => Promise.resolve(null));

  if (packageInfos != null && packageInfos.length > 0) {
    return packageInfos[0].git;
  }

  return "not find";
}
