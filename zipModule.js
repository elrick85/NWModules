/**
 * Created by Zaur_Ismailov on 9/4/2015.
 */
var EasyZip = require("easy-zip").EasyZip;
var Q = require("q");

module.exports = {
    zipFolder: function(path, upath) {
        var defer = Q.defer();
        var zip5 = new EasyZip();

        zip5.zipFolder(path, function() {
            zip5.writeToFile(upath, function() {
                defer.resolve(true);
            });
        });

        return defer.promise;
    }
};