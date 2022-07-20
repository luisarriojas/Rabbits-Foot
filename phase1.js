const https = require("https");
const cheerio = require('cheerio');

//obtener link de la DB.
let options = new URL('https://www.romspedia.com/roms/super-nintendo');

let req = https.request(options, function(res) {
    let content = "";
    res.setEncoding("utf8");

    res.on("data", function (chunk) {
        content += chunk;
    });

    res.on("end", function () {
        const $ = cheerio.load(content);
        $('div.roms-img a').get().forEach((link) => {
            console.log(link.attribs.href);
        });
    });
});
req.end();