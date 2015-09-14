/**
 * Created by Zaur_Ismailov on 9/14/2015.
 */
var sg = require('simple-git');
var Q = require("q");

var gitLog = (function(options, callback){
    var command = ["log", "--pretty=format:'%H;%ai;%s%d;%aN;%ae'"];
    var opt = {};

    var args = [].slice.call(arguments, 0);
    var handler = typeof args[args.length - 1] === "function" ? args.pop() : null;

    if (!args.length) {
        opt = {};
    }
    else if (typeof args[0] === "object") {
        opt = args[0];
    }
    else if (typeof args[0] === "string" || typeof args[1] === "string") {
        this._getLog('warn',
            'Git#log: supplying to or from as strings is now deprecated, switch to an options configuration object');
        opt = {
            from: args[0],
            to: args[1]
        };
    }

    if (opt.from && opt.to) {
        command.push(opt.from + "..." + opt.to);
    }

    if (opt.file) {
        command.push("--", options.file);
    }

    return this._run(command, function (err, data) {
        handler && handler(err, !err && this._parseListLog(data));
    });
});

module.exports = {
    gitFetch: function(repo, branch) {
        var sGit = sg(repo);
        var defer = Q.defer();

        sGit.fetch("o1", branch, function(err, data){

            if(!err){
                defer.resolve(data);
            } else {
                defer.reject(err);
            }
        });

        return defer.promise;
    },

    createFileLog: function(filename, repo) {
        var defer = Q.defer();

        var simpleGit = sg(repo);

        gitLog.call(simpleGit, {file: filename}, function(err, log){
            if(!err){
                defer.resolve(log);
            } else {
                defer.reject(err);
            }
        });

        return defer.promise;
    }
};