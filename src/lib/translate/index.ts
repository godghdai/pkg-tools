import baidu from "./baidu";
import qq from "./qq";
import youdao from "./youdao";
import {ITranslate} from "../Interface/ITranslate";

const fullnames = ["baidu", "qq", "youdao"];

function getFullName(engine : string) {
  var index = fullnames.findIndex(name => {
    return name.charAt(0) == engine;
  })
  if (index != -1)
    return fullnames[index];
  return "youdao";
}

const EngineInstances : any = {
  'baidu': new baidu(),
  'qq': new qq(),
  'youdao': new youdao()
}

export function getEngineInstance(engine : string) {
  var translate : ITranslate = null;
  return EngineInstances[getFullName(engine)];
}
