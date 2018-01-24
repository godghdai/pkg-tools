"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const eventBus = new events_1.EventEmitter();
exports.default = {
    sendMessageToMaster(playload) {
        eventBus.emit("master", playload);
    },
    setMaster(listener) {
        return eventBus.addListener("master", listener);
    }
};
//# sourceMappingURL=eventbus.js.map