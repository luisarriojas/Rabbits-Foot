const https = require('https');
const cheerio = require('cheerio');
const {MongoClient} = require('mongodb');

async function main() {
    console.clear();
    
    const uri = "mongodb://localhost:27017";
    let mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    await getHtml(mongoClient);
    await mongoClient.close(); 
}

async function getHtml(mongoClient) {
    return new Promise((resolve)=> {
        //get link from DB.
        let options = new URL('https://www.romspedia.com/roms/super-nintendo');

        let request = https.request(options, (response) => {
            let content = "";

            response.setEncoding("utf8");
            response.on("data", (chunk) => {
                content += chunk;
            });

            response.on("end", async () => {
                const collection = mongoClient.db('rabbits-foot').collection('phase1');
                const $ = cheerio.load(content);
                
                const linkList = [];
                $('div.roms-img a').get().forEach((link, index) => {
                    linkList.push({
                        url: link.attribs.href
                    });
                });

                if (linkList.length > 0) {
                    collection.insertMany(linkList)
                        .then(() => {
                            resolve();
                        })
                } else {
                    resolve();
                }
            });
        });

        request.end();
    });
};

main();