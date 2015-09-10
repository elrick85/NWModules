/**
 * Created by Zaur_Ismailov on 9/8/2015.
 */
var Q = require("q");
var cProcess = require('child_process');
var crypto = require('crypto');
var fs = require('fs');
var opensslPath = "openssl/bin/openssl.exe";
var defaultPass = "11111";

var createChainItem = function(callback) {
    var defer = Q.defer();

    callback(defer.resolve, defer.reject, defer.notify);

    return defer.promise;
};

var createSignChainItem = function(options) {
    return createChainItem(function(resolve, reject) {
        var proc = cProcess.execFile(opensslPath, options);
        proc.on('close', resolve);
        proc.on('error', reject);
    });
};

module.exports = {

    /**
     * Create file hash.
     * @param path - file path.
     */
    createHash: function(path) {
        return createChainItem(function(resolve, reject) {
            var shasum = crypto.createHash('sha1');
            var reader = fs.createReadStream(path);

            reader.on('data', function(d) {
                shasum.update(d);
            });

            reader.on("error", function(err) {
                reject(err);
            });

            reader.on('end', function() {
                var d = shasum.digest('hex');
                resolve(d);
            });
        });
    },

    /**
     * Sign file hash.
     * @param path - file path.
     * @param privateKey - private key path.
     * @param callback
     */
    signFile: function(path, privateKey) {
        var sign = crypto.createSign('RSA-SHA256');
        var privatePem = fs.readFileSync(privateKey);
        var key = privatePem.toString();

        return this.createHash(path)
            .then(function(hash) {
                sign.update(hash);
                return sign.sign(key, "hex");
            });
    },

    /**
     * Verify signed file.
     * @param sign - file sign
     * @param path - file path
     * @param publicKeyPath - public key path
     * @param callback
     */
    verifySign: function(sign, path, publicKeyPath) {
        var publicPem = fs.readFileSync(publicKeyPath);
        var key = publicPem.toString();

        return this.createHash(path)
            .then(function(hash) {
                var verify = crypto.createVerify('RSA-SHA256');
                verify.update(hash);
                return verify.verify(key, sign, 'hex');
            });
    },

    createPrivateKey: function(path) {
        var options = ["genrsa", "-des3", "-passout", "pass:" + defaultPass, "-out", path, "2048"];
        return createSignChainItem(options);
    },

    createPublicKey: function(pKeyPath, path) {
        var options = ["rsa", "-in", pKeyPath, "-outform", "PEM", "-pubout", "-out", path];
        return createSignChainItem(options);
    },

    /**
     * Create root certificate.
     * @param path - server.key
     * @param upath - server.csr
     */
    createRootCertificate: function(path, upath) {
        var options = ["req", "-new", "-key", path, "-out", upath];
        return createSignChainItem(options);
    },

    /**
     * Remove pass from key.
     * @param path - server.key
     */
    removePassPhrase: function(path) {
        var data = fs.readFileSync(path);
        var fd = path + ".tmp";
        fs.writeFileSync(fd, data);

        var options = ["rsa", "-passin", "pass:" + defaultPass, "-in", fd, "-out", path];
        return createSignChainItem(options)
            .then(function() {
                fs.unlinkSync(fd);
                return true;
            });
    },

    /**
     * Create self-signed certificate.
     * @param rootCAPath - server.csr
     * @param rootCAKey - server.key
     * @param upath - server.cer
     */
    createSelfSignedCert: function(rootCAPath, rootCAKey, upath) {
        var options = ["x509", "-req", "-days", "365", "-in", rootCAPath, "-signkey", rootCAKey, "-out", upath];
        return createSignChainItem(options);
    }
};