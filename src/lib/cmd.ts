import {spawn} from 'child_process';
import * as which from 'which';
class CMD {
  private cmd : string;
  constructor(cmd : string) {
    this.cmd = cmd;
  }
  run(params : Array < string >) : Promise < (string | Buffer)[] > {
    return new Promise((resolve, reject) => {
      console.log(this.cmd, params);
      const child = spawn(this.cmd, params, {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      child.on("err", reject);
      let data : (string | Buffer)[] = [];
      child
        .stdout
        .on("data", chunk => {
          data.push(chunk);
        })
        .on("close", () => {
          resolve(data);
        });
    });
  }

  runWithOutOutput(params : Array < string >) : Promise < boolean > {
    return new Promise((resolve, reject) => {
      spawn(this.cmd, params, {stdio: 'inherit'})
        .on("err",err=> reject(false))
        .on("close",()=> resolve(true));
    });
  }
}

export function getCmdInstance(cmd : string) : CMD {
  which.sync(cmd);
  return new CMD(cmd);
};
