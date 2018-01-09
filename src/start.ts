import git from "./lib/git";
import npm from "./lib/npm";
async function start(){
  var result= await npm.versions2('thinkjs')
  console.log(result);
}

start().catch(ex=>{
  console.log(ex);
});
