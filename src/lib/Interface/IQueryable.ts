import {valid} from 'semver';

export interface PackageInfo {
  name : string,
  desc?: string
  git : string,
  npm : string
}

export interface IQueryablePackageInfo {
  search(keyword : string,limit?: number, page?: number, ...params : any[]) : Promise <PackageInfo[]>;
  getVersions(packageName : string) : Promise < string[] >;
  getLastVersions(packageName : string, limit?: number) : Promise < string[] >;
  getVersionsByRange(packageName : string, range : string) : Promise < string[] >;
}

