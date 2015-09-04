/**
 * Created by Zaur_Ismailov on 9/4/2015.
 */
var cryptModule = require("../cryptModule");
var zipModule = require("../zipModule");
var key = "asdasdasdasdasdasdasdasdasd";

exports.encryptTest = function(test){
    cryptModule.encrypt("test/app/index.html", "test/index.enc", key, function(){
        test.ok(true, 'Encrypted file written to disk!');
        test.done();
    });
};

exports.decryptTest = function(test){
    cryptModule.decrypt("test/index.enc", "test/index.dec.html", key, function(){
        test.ok(true, 'Decrypted file written to disk!');
        test.done();
    });
};

exports.zipTest = function(test){
    zipModule.zipFolder("test/app", "test/app1.zip", function(){
        test.ok(true, 'Zipped file written to disk!');
        test.done();
    });
};

exports.workflowTest = function(test){
    zipModule.zipFolder("test/app", "test/app.zip", function(){
        cryptModule.encrypt("test/app.zip", "test/app.zip.enc", key, function(){
            test.ok(true, 'Encrypted ZIP file written to disk!');
            test.done();
        });
    });
};