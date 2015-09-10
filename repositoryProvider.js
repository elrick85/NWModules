/**
 * Created by Zaur_Ismailov on 9/10/2015.
 */
var https = require("https");

var sendRequest = function(options, callback) {
    options["hostname"] = "git.epam.com";
    options["method"] = options.method || "GET";

    var req = https.request(options, function(res) {
        res.setEncoding('utf8');

        var str = "";
        res.on('data', function(chunk) {
            str += chunk;
        });

        res.on('end', function() {
            var data, err;
            try {
                data = JSON.parse(str);
                console.log(data);
            }
            catch(e) {
                err = e;
            }

            callback(err, data);
        })
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
};

module.exports = {
    projects: function(privateKey, callback) {
        var options = {
            path: "/api/v3/projects",
            headers: {
                "PRIVATE-TOKEN": privateKey
            }
        };

        sendRequest(options, callback);
    },

    repositoryTree: function(id, privateKey, callback) {
        var options = {
            path: "/api/v3/projects/" + id + "/repository/tree",
            headers: {
                "PRIVATE-TOKEN": privateKey
            }
        };

        sendRequest(options, callback);
    }
};
