const https = require("https");

let options = new URL('https://www.romspedia.com/roms/super-nintendo');

let req = https.request(options, function(res) {
    let content = "";
    res.setEncoding("utf8");

    res.on("data", function (chunk) {
        content += chunk;
    });

    res.on("end", function () {
        console.log(content);
    });
});
req.end();