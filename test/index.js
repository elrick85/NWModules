/**
 * Created by Zaur_Ismailov on 9/4/2015.
 */
var fs = require("fs");
var Q = require("q");
var cryptModule = require("../cryptModule");
var repositoryProvider = require("../repositoryProvider");
var zipModule = require("../zipModule");
var signModule = require("../signModule");
var ppk = "test/keys/private.pem";
var pubpk = "test/keys/public.pem";
var pass = "elrick";

var deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

/*
 exports.encryptTest = function(test) {
 var opt = { key: pubpk, passphrase: pass };

 cryptModule.encrypt("test/app/index.html", "test/index.enc", opt, function() {
 test.ok(true, 'Encrypted file written to disk!');
 test.done();
 });

 };

 exports.decryptTest = function(test) {
 var opt = { key: ppk, passphrase: pass };

 cryptModule.decrypt("test/index.enc", "test/index.dec.html", opt, function() {
 test.ok(true, 'Decrypted file written to disk!');
 test.done();
 });

 };*/

exports.createPrivateKeyTest = function(test) {
    var keyPath = "test/key.key";

    var exist = fs.existsSync(keyPath);
    exist && fs.unlinkSync(keyPath);

    signModule
        .createPrivateKey(keyPath)
        .then(function() {
            var exist = fs.existsSync(keyPath);
            exist && fs.unlinkSync(keyPath);

            test.ok(exist, "Private key created");
        })
        .fail(function(err) {
            console.log(err);
            test.ok(false, "Private key was not create");
        })
        .fin(function() {
            test.done();
        })
};

exports.removePassPhraseTest = function(test) {
    var keyPath = "test/key.key";

    var exist = fs.existsSync(keyPath);
    exist && fs.unlinkSync(keyPath);

    signModule
        .createPrivateKey(keyPath)
        .then(function() {
            return signModule
                .removePassPhrase(keyPath)
                .then(function() {
                    var exist = fs.existsSync(keyPath);
                    exist && fs.unlinkSync(keyPath);

                    test.ok(true, "Private key passphrase removed!");
                });
        })
        .fail(function(err) {
            console.log(err);
            test.ok(false, "Private key passphrase was not remove");
        })
        .fin(function() {
            test.done();
        });
};

exports.createPublicKeyTest = function(test) {
    var keyPath = "test/key.key";
    var pubKeyPath = "test/pubkey.key";

    var exist = fs.existsSync(keyPath);
    exist && fs.unlinkSync(keyPath);

    signModule
        .createPrivateKey(keyPath)
        .then(function() {
            return signModule
                .removePassPhrase(keyPath)
        })
        .then(function() {
            return signModule
                .createPublicKey(keyPath, pubKeyPath)
                .then(function() {
                    var exist = fs.existsSync(keyPath);
                    var pexist = fs.existsSync(pubKeyPath);
                    exist && fs.unlinkSync(keyPath);
                    pexist && fs.unlinkSync(pubKeyPath);

                    test.ok(pexist, "Public key created!");
                });
        })
        .fail(function(err) {
            console.log(err);
            test.ok(false, "Public key was not create");
        })
        .fin(function() {
            test.done();
        });
};

exports.zipTest = function(test) {
    var zipPath = "test/app1.zip";
    var sourcePath = "test/app";
    var exist = fs.existsSync(zipPath);
    exist && fs.unlinkSync(zipPath);

    zipModule
        .zipFolder(sourcePath, zipPath)
        .then(function() {
            var exist = fs.existsSync(zipPath);
            test.ok(exist, 'Zipped file written to disk!');

            exist && fs.unlinkSync(zipPath);
        })
        .fail(function(err) {
            console.log(err);
            test.ok(false, "Zipped file was not write to disk!");
        })
        .fin(function() {
            test.done();
        });
};

exports.signTest = function(test) {
    var filePath = "test/app/index.html";
    var privateKey = "test/keys/key.key";
    var publicKey = "test/keys/pubkey.key";

    signModule
        .signFile(filePath, privateKey)
        .then(function(sign) {
            return signModule.verifySign(sign, filePath, publicKey);
        })
        .then(function(res) {
            test.ok(res, "Sign verified");
        })
        .fail(function(err) {
            console.log(err);
            test.ok(false, "Sign was not verify");
        })
        .fin(function() {
            test.done();
        });
};

exports.workflowTest = function(test) {
    var appFolder = "test/app";
    var packPath = "test/pack";
    var appZippedPath = packPath + "/app.zip";

    deleteFolderRecursive(packPath);
    fs.mkdirSync(packPath);

    signModule
        .createPrivateKey(ppk)
        .then(function() {
            return signModule.removePassPhrase(ppk);
        })
        .then(function() {
            return signModule.createPublicKey(ppk, pubpk);
        })
        .then(function() {
            return zipModule.zipFolder(appFolder, appZippedPath);
        })
        .then(function() {
            return signModule.signFile(appZippedPath, ppk);
        })
        .then(function(sign) {
            var verifySign = signModule.verifySign(sign, appZippedPath, pubpk);

            return [verifySign, sign];
        })
        .spread(function(res, sign) {
            var data = fs.readFileSync(pubpk);

            fs.writeFileSync(packPath + "/app.sgn", sign);
            fs.writeFileSync(packPath + "/app.key", data);

            return zipModule.zipFolder(packPath, packPath + ".pack");
        })
        .then(function() {
            deleteFolderRecursive(packPath);
            test.ok(true, 'Pack compressed');
        })
        .fail(function(err) {
            console.log(err);
            test.ok(false, 'Pack was not compress');
        })
        .fin(function() {
            test.done();
        });
};

exports.repositoryProjectsTest = function(test){
    repositoryProvider.projects("ouq42JtWqx2aGitZT-TD", function(err, data){
        test.ok(!err, "Data received");
        test.done();
    });
};

exports.repositoryProjectTreeTest = function(test){
    repositoryProvider.repositoryTree(7277, "pdfs", "ouq42JtWqx2aGitZT-TD", function(err, data){
        test.ok(!err, "Data received");
        test.done();
    });
};

exports.repositoryProjectFileInfoTest = function(test){
    repositoryProvider.repositoryFile(7277, "pdfs/Page1.pdf", "ouq42JtWqx2aGitZT-TD", function(err, data){
        test.ok(!err, "Data received");
        test.done();
    });
};

exports.repositoryProjectCreateFileTest = function(test){
    var data = {
        branch: "test",
        path: "test/testFiles/Page1test.pdf",
        comment: "Test file create."
    };

    repositoryProvider.createRepositoryFile(7277, "pdfs/Page2test.pdf", data, "ouq42JtWqx2aGitZT-TD", function(err){
        test.ok(!err, "File created");

        data = {
            branch: "test",
            path: "test/testFiles/Page2test.pdf",
            comment: "Test file update."
        };

        repositoryProvider.updateRepositoryFile(7277, "pdfs/Page2test.pdf", data, "ouq42JtWqx2aGitZT-TD", function(err){
            test.ok(!err, "File updated");

            data = {
                branch: "test",
                comment: "Test file remove."
            };

            repositoryProvider.removeRepositoryFile(7277, "pdfs/Page2test.pdf", data, "ouq42JtWqx2aGitZT-TD", function(err){
                test.ok(!err, "File removed");

                test.done();
            });
        });
    });
};