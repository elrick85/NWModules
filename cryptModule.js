/**
 * Created by Zaur_Ismailov on 9/4/2015.
 */

var fs = require('fs'),
    crypto = require('crypto');

var cProcess = require('child_process');
var opensslPath = "openssl/bin/openssl.exe";

function fileEncrypt(path, upath, key, callback) {
    var options = ["smim", "-encrypt -binary -des3",
                   "-in", path,
                   "-passin", "pass:" + key.passphrase,
                   "-outform", "DER",
                   "-out", upath,
                   "-inkey", key.key];
    var proc = cProcess.execFile(opensslPath, options);
    proc.on("close", callback);
}

function fileDecrypt(path, upath, key, callback) {
    var options = ["smim", "-decrypt -binary -des3",
                   "-in", path,
                   "-passin", "pass:" + key.passphrase,
                   "-outform", "DER",
                   "-out", upath,
                   key.key];
    var proc = cProcess.execFile(opensslPath, options);
    proc.on("close", callback);
}

module.exports = {
    encrypt: fileEncrypt,

    decrypt: fileDecrypt
};