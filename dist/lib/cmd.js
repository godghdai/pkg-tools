"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const which = require("which");
class CMD {
    constructor(cmd) {
        this._cmd = cmd;
    }
    get cmd() {
        return this._cmd;
    }
    set cmd(value) {
        which.sync(value);
        this._cmd = value;
    }
    run(params) {
        return new Promise((resolve, reject) => {
            const child = child_process_1.spawn(this._cmd, params, {
                stdio: ['pipe', 'pipe', 'pipe']
            });
            child.on("err", reject);
            let data = [];
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
    runWithOutOutput(params) {
        return new Promise((resolve, reject) => {
            child_process_1.spawn(this._cmd, params, { stdio: 'inherit' })
                .on("err", err => reject(false))
                .on("close", () => resolve(true));
        });
    }
}
function getCmdInstance(cmd) {
    which.sync(cmd);
    return new CMD(cmd);
}
exports.getCmdInstance = getCmdInstance;
;
//# sourceMappingURL=cmd.js.map