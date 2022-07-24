const https = require("https");
const cheerio = require('cheerio');
const {MongoClient} = require('mongodb');

async function main() {
    console.clear();
    const uri = "mongodb://localhost:27017";
    new MongoClient(uri).connect()
        .then(mongoClient => getHtml(mongoClient))
        .catch(e => console.log(e));
}

function getHtml(mongoClient) {
    //get link from DB.
    let options = new URL('https://www.romspedia.com/roms/super-nintendo');

    let req = https.request(options, (res) => {
        let content = "";
    
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
            content += chunk;
        });

        res.on("end", async () => {
            const collection = mongoClient.db('rabbits-foot').collection('phase1');
            const $ = cheerio.load(content);
            const linkList = [];
            $('div.roms-img a').get().forEach((link) => {
                linkList.push({
                    url: link.attribs.href
                });
            });

            if (linkList.length > 0) {
                await collection.insertMany(linkList);
            }

            await mongoClient.close(); 
        });
    });

    req.end();
};

main();