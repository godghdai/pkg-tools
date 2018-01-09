import {spawn} from 'child_process';
import * as which from 'which';
class CMD {
  private _cmd : string;
  constructor(cmd : string) {
    this._cmd = cmd;
  }
  get cmd() {
    return this._cmd;
  }
  set cmd(value) {
    which.sync(value);
    this._cmd = value;
  }
  run(params : Array < string >) : Promise < (string | Buffer)[] > {
    return new Promise((resolve, reject) => {
      const child = spawn(this._cmd, params, {
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
      spawn(this._cmd, params, {stdio: 'inherit'})
        .on("err", err => reject(false))
        .on("close", () => resolve(true));
    });
  }
}

export function getCmdInstance(cmd : string) : CMD {
  which.sync(cmd);
  return new CMD(cmd);
};
