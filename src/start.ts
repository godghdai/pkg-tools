import git from "./lib/git";
import npm from "./lib/npm";
async function start(){
  var result= await git.search('thinkjs')
  console.log(result);
}

start().catch(ex=>{
  console.log(ex);
});
