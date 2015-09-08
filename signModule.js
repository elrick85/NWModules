/**
 * Created by Zaur_Ismailov on 9/8/2015.
 */
var cProcess = require('child_process');
var opensslPath = "openssl/bin/openssl.exe";

module.exports = {
    createPrivateKey: function(pass, path, callback) {
        //pem.createCertificate({ days: days, selfSigned: selfSigned }, callback);
        var options = ["genrsa", "-des3", "-passout", "pass:" + pass, "-out",
                       path, "2048"];
        var proc = cProcess.execFile(opensslPath, options);
        proc.on('close', callback);
    },

    createPublicKey: function(pass, pKeyPath, path, callback) {
        var options = ["rsa", "-in", pKeyPath, "-outform", "PEM", "-pubout", "-out", path, "-passin", "pass:"+pass];
        var proc = cProcess.execFile(opensslPath, options);
        proc.on('close', callback);
    }
};