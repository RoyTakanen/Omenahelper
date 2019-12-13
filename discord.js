const https = require('https');
const moment = require('moment');
const discord = require('discord.js');
const client = new discord.Client();

var date = new Date();

client.on('ready', () => {
  console.log("Logged in as " + client.user.tag)
});

client.on('message', msg => {
  if (msg.content == "!ruoka") {
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
                for (let nro = 0; nro < 5; nro++) {
                    viesti += paivat[nro] + ' ' + jsondata.foods[nro].lunch + "\n";
                }
            } catch(error) {
                console.log("Error " + error);
                viesti = "Virheellinen päivämäärä. Tänään on " + formattedday.format("MMM Do YY"); + "\n";
            }

            viesti += "\nTekijänä @Erikoisjääkäri#0939";
            msg.reply(viesti);
        });
    });
  }
});

client.login('TÄHÄN_TOKEN');
