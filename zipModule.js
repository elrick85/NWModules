/**
 * Created by Zaur_Ismailov on 9/4/2015.
 */
var EasyZip = require("easy-zip").EasyZip;

module.exports = {
    zipFolder: function(path, upath, callback){
        var zip5 = new EasyZip();

        zip5.zipFolder(path,function(){
            zip5.writeToFile(upath, callback);
        });
    }
};