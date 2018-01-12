import git from "./lib/git";
import npm from "./lib/npm";
async function start2(){
  var result= await npm.getLastVersions('thinkjs',5)
  console.log(JSON.stringify(result));
}

start2().catch(ex=>{
  console.log(ex);
});

import Youdao from './lib/translate/youdao'

new Youdao().translate("中国d").then(res=>{
  console.log(res);
}).catch(err => {
  console.log(err);
});
