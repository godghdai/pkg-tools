import config from '../../config';
const {TRANSLATE_ENGINES, TRANSLATE_ENGINE_SELECT_DEFAULT} = config;

import {ITranslate, ITranslateResult} from "../Interface/ITranslate";

function getFullName(engine : string) {
  var index = TRANSLATE_ENGINES.findIndex(name => name.charAt(0) == engine);
  if (index != -1)
    return TRANSLATE_ENGINES[index];
  return TRANSLATE_ENGINE_SELECT_DEFAULT;
}

let EngineInstances : Map < string,
  ITranslate >= new Map();

export function getEngineInstance(engine : string) : ITranslate {
  let fullname = getFullName(engine);
  if (!EngineInstances.has(fullname)) {
    let cls = require(`./engine/${fullname}`).default;
    EngineInstances.set(fullname, new cls());
  }
  return EngineInstances.get(fullname);
}

export async function translate(word : string, engine : string) : Promise < ITranslateResult > {
  return getEngineInstance(engine).translate(word);
}
