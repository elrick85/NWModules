/**
 * Created by Zaur_Ismailov on 9/14/2015.
 */
var cp = require('child_process');
var fs = require("fs");
var Q = require("q");
var gitProvider = require("../gitlogProvider");
var file_path = "pdfs\\balances\\balance091115.pdf";
var repo_path = __dirname + "\\..\\..\\perkinelmer";
var branch_name = "test";

exports.fetchGitTest = function(test) {
    var c1 = "git fetch o1";
    var c2 = "git status";
    var ch = cp.exec(c2, { cwd: "D:/Dev/perkinelmer" });

    ch.stdout.on("data", function(stdout){
        console.log('stdout: ' + stdout);
        test.ok(true, stdout);
    });

    ch.on("error", function(){
        test.done();
    })

    ch.stderr.on("data", function(err){
        test.ok(false, err);
    });

    ch.on("close", function(err, stdout, stderr){
        test.done();
    });

    /*gitProvider
     .gitFetch(repo_path, branch_name)
     .then(function(log) {
     console.log(log);
     test.ok(true, "Fetch runned");
     })
     .fail(function() {
     test.ok(false, "Fetch was not run");
     })
     .fin(function() {
     test.done();
     });*/
};

exports.getGitLogForFileTest = function(test) {

    gitProvider
        .createFileLog(file_path, repo_path)
        .then(function(log) {
            //console.log(log);
            test.ok(true, "Log loaded");

        })
        .fail(function() {
            test.ok(false, "Log was not load");
        })
        .fin(function() {
            test.done();
        })
};