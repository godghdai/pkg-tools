exports.command = 'quit';
exports.aliases = ['q', 'exit'];
exports.describe = '退出';
exports.builder = function (yargs : any) {}
exports.handler = function (argv : any) {
    argv._commandComplete({type: "exit"});
}
