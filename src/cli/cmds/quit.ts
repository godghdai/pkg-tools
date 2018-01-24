exports.command = 'quit';
exports.aliases = ['q', 'exit'];
exports.describe = 'quit the commander';
exports.builder = function (yargs : any) {

}
exports.handler = function (argv : any) {
    argv._commandComplete({
        type:"exit"
    });
}
