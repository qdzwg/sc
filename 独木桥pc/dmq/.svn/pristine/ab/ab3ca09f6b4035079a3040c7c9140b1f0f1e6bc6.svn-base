var log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: 'console',
            category: "console"
        },
        {
            type: "dateFile",
            filename: './weblogs/logs/log.log',
            pattern: "_yyyy-MM-dd.log",
            absolute: false,
            category: 'dateFileLog'
        }
    ],
    replaceConsole: true,   //替换console.log
    levels:{
        dateFileLog: 'INFO',
        console: 'debug'
    }
});

var dateFileLog = log4js.getLogger('dateFileLog');
var consoleLog = log4js.getLogger('console');
exports.logger = consoleLog;


exports.use = function(app) {
    app.use(log4js.connectLogger(consoleLog, {level:'auto', format:':method :url'}));
}
