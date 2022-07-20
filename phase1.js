const https = require("https");
const cheerio = require('cheerio');
const {MongoClient} = require('mongodb');

async function main() {
    console.clear();

    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);
    try {
        await client.connect().then(getHtml());
    } catch (e) {
        console.error(e);
    } finally {
        await client.close(); 
    }
}

function getHtml() {
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
};

main();