declare interface ICONFIG {
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

declare namespace NodeJS {
  export interface Global{
    CONFIG : ICONFIG
  }
}

declare var global:NodeJS.Global;
declare var CONFIG:ICONFIG;
