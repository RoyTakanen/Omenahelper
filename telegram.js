const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const moment = require('moment');

const token = '';

const bot = new TelegramBot(token, {polling: true});

var date = new Date();

//https://api.koulusafka.fi/get/index.php?a=2019-12-11&b=fgfdg905hnm490jiofsdydy346gfgd&c=Aurinkolahden_peruskoulu&tylyurl=&_=1576054557009


/* Korjaa ettei voi häkätä eli lisää on error */

bot.onText(/\/ruoka (.+)/, (msg, lisä) => {
    var year = lisä[1];

    //Pitää lähettää /ruoka 2019-08-11

    https.get('https://api.koulusafka.fi/get/index.php?a=' + year + '&b=fgfdg905hnm490jiofsdydy346gfgd&c=Aurinkolahden_peruskoulu&tylyurl=&_=1576054557009', (resp) => {
        var data = '';
        let formattedday = moment(year);

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            //bot.sendMessage(msg.chat.id, data);
            try {
                jsondata = JSON.parse(data);
                paivat = ["Ma:", "Ti:", "Ke:", "To:", "Pe:"];

                var viesti = "Ruokana on (vko " + formattedday.week() + "):\n";
                var nro = 0;
                jsondata.foods.forEach(function(element){
                  viesti += paivat[nro] + " " + element.lunch + "\n";
                  nro++;
                });
            } catch(error) {
                console.log("Error " + error);
                viesti = "Virheellinen päivämäärä\n"
            }

            viesti += "\nTekijänä Roy";
            bot.sendMessage(msg.chat.id, viesti)
        });
    }).on('error', (e) => {
        console.error(e);
        bot.sendMessage(msg.chat.id, "Virhe (muutama vaihtoehto):\n1. Virheellinen päivämäärä\n2. Häkkäysyritys\n3. Tunnistamaton virhe");
    });
});


//Start komento
bot.on('message', (msg) => {
    if (msg.text.toString().toLowerCase() == "/ruoka" || msg.text.toString().toLowerCase() == "/ruoka@omenahelper_bot") {
        var month = date.getUTCMonth() + 1;
        https.get('https://api.koulusafka.fi/get/index.php?a=' + date.getUTCFullYear() + '-' + month + '-' + date.getUTCDate() + '&b=fgfdg905hnm490jiofsdydy346gfgd&c=Aurinkolahden_peruskoulu&tylyurl=&_=1576054557009', (resp) => {
        var formattedday = moment(date.getUTCFullYear() + '-' + month + '-' + date.getUTCDate());
        var data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                //bot.sendMessage(msg.chat.id, data);
                try {
                    jsondata = JSON.parse(data);
                    paivat = ["Ma:", "Ti:", "Ke:", "To:", "Pe:"];

                    var viesti = "Ruokana on (vko " + formattedday.week() + "):\n";
                    var nro = 0;
                    jsondata.foods.forEach(function(element){
                      viesti += paivat[nro] + " " + element.lunch + "\n";
                      nro++;
                    });
                } catch(error) {
                    console.log("Error " + error);
                    viesti = "Virheellinen päivämäärä. Tänään on " + formattedday.format("MMM Do YY"); + "\n";
                }
                viesti += "\nTekijänä Roy";
                bot.sendMessage(msg.chat.id, viesti)
            });
        });
    }
    if (msg.text.toString().toLowerCase().includes("/start" || msg.text.toString().toLowerCase() == "/start@omenahelper_bot")) {
        bot.sendMessage(msg.chat.id, "Kouluruoka Aurinkolahden Peruskolussa\n\nKäyttää koulusafka.fi:n APIa\nTekijänä t.me/roysuomi\nGithub: github.com/kaikkitietokoneista/omenahelper\nKrediitit Roylle\n\n Viesti /apua kertoo kuinka tätä kuuluu käyttää.")
    }
    if (msg.text.toString().toLowerCase().includes("/apua" || msg.text.toString().toLowerCase() == "/apua@omenahelper_bot")) {
        bot.sendMessage(msg.chat.id, "Komentosyntaksi on seuraavanlainen:\n/apua  - näyttää tämän\n/ruoka - kertoo nykyisen viikon ruoan\n/ruoka 2019-08-11 - kertoo päivämäärän viikon ruoan")
    }
});
