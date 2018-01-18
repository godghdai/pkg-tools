import * as readMetadata from 'read-metadata';
import * as path from 'path';

export interface Config {
  NPM_REGISTRY_URL : string
  NPM_SEARCH_URL : string
  GITHUB_REPOSITORIES_URL : string
  TRANSLATE_ENGINES : string[]
  PACKAGE_CMDS : string[]
  PACKAGE_CMDS_SELECT_DEFAULT : string
  TRANSLATE_ENGINE_SELECT_DEFAULT : string
  RESULT_LIST_LIMIT_DEFAULT : number
  COOKIES_SAVE_PATH_DEFAULT : string
}

const config : Config = (function () {
  let config = readMetadata.sync(path.join(__dirname, "../config.yml"));
  config['COOKIES_SAVE_PATH_DEFAULT'] = path.join(__dirname, config['COOKIES_SAVE_PATH_DEFAULT']);
  return config;
})();

export default config
