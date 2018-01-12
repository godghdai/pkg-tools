import git from "./lib/git";
import npm from "./lib/npm";
async function start(){
  var result= await npm.getLastVersions('thinkjs',5)
  console.log(JSON.stringify(result));
}

start().catch(ex=>{
  console.log(ex);
});
