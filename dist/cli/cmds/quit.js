exports.command = 'quit';
exports.aliases = ['q', 'exit'];
exports.describe = '退出';
exports.builder = function (yargs) { };
exports.handler = function (argv) {
    argv._commandComplete({ type: "exit" });
};
//# sourceMappingURL=quit.js.map