/**
 * Created by Zaur_Ismailov on 9/4/2015.
 */

var fs = require('fs'),
    crypto = require('crypto');

function fileEncrypt(path, upath, key, callback) {
    var cipher = crypto.createCipher('aes-256-cbc', key),
        input = fs.createReadStream(path),
        output = fs.createWriteStream(upath);

    input.pipe(cipher).pipe(output);

    output.on('finish', function() {
        callback();
    });
}

function fileDecrypt(path, upath, key, callback){
    var decipher = crypto.createDecipher('aes-256-cbc', key),
        dInput = fs.createReadStream(path),
        dOutput = fs.createWriteStream(upath);

    dInput.pipe(decipher).pipe(dOutput);

    dOutput.on('finish', function() {
        callback();
    });
}

module.exports = {
    encrypt: fileEncrypt,

    decrypt: fileDecrypt
};