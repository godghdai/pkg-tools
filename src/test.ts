import git from "./lib/git";
import npm from "./lib/npm";
import {getGitUrlByPackName} from "./lib/tools";
async function start2(){
  var result= await npm.getLastVersions('thinkjs',5)
  console.log(JSON.stringify(result));
}

getGitUrlByPackName("think").then(a=>{
  console.log(a);
}).catch(ex=>{
  console.log(ex);
});

