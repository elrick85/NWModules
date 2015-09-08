/**
 * Created by Zaur_Ismailov on 9/4/2015.
 */
var fs = require("fs");
var cryptModule = require("../cryptModule");
var zipModule = require("../zipModule");
var signModule = require("../signModule");
var ppk = "test/keys/private.pem";
var pubpk = "test/keys/public.pem";
var pass = "elrick";

exports.encryptTest = function(test) {
    var opt = { key: pubpk, passphrase: pass };

    cryptModule.encrypt("test/app/index.html", "test/index.enc", opt, function() {
        test.ok(true, 'Encrypted file written to disk!');
        test.done();
    });
    /*fs.unlink("test/index.enc", function(err) {

    });*/
};

exports.decryptTest = function(test) {
    var opt = { key: ppk, passphrase: pass };

    cryptModule.decrypt("test/index.enc", "test/index.dec.html", opt, function() {
        test.ok(true, 'Decrypted file written to disk!');
        test.done();
    });
    /*fs.unlink("test/index.dec.html", function() {

    });*/
};
/*
exports.zipTest = function(test) {
    fs.unlinkSync("test/app1.zip");

    zipModule.zipFolder("test/app", "test/app1.zip", function() {
        test.ok(true, 'Zipped file written to disk!');
        test.done();
    });
};

exports.createKeysTest = function(test) {
    fs.unlinkSync(ppk);
    fs.unlinkSync(pubpk);

    signModule.createPrivateKey(pass, ppk, function(code) {
        test.ok(code === 0, 'Private key created!');

        signModule.createPublicKey(pass, ppk, pubpk, function(pcode) {
            test.ok(pcode === 0, 'Public key created!');

            test.done();
        });
    });
};*/
/*
 exports.workflowTest = function(test) {
 signModule.createPrivateKey(pass, ppk, function(code) {
 test.ok(code === 0, 'Private key created!');

 signModule.createPublicKey(pass, ppk, pubpk, function(pcode) {
 test.ok(pcode === 0, 'Public key created!');

 zipModule.zipFolder("test/app", "test/app.zip", function() {
 test.ok(true, 'Zipped file written to disk!');

 var buffer = fs.readFileSync(pubpk);

 cryptModule.encrypt("test/app.zip", "test/app.zip.enc", buffer, function() {
 test.ok(true, 'Encrypted ZIP file written to disk!');

 var buffer1 = fs.readFileSync(ppk);

 cryptModule.decrypt("test/index.enc", "test/index.dec.html", buffer1, function() {
 test.ok(true, 'Decrypted file written to disk!');

 test.done();
 });
 });
 });
 });
 });
 };*/