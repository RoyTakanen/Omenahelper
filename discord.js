const https = require('https');
const moment = require('moment');
const discord = require('discord.js');
const client = new discord.Client();

//voi sanoo !ruoka (insert koulu)


var date = new Date();

client.on('ready', () => {
  console.log("Logged in as " + client.user.tag)
});

client.on('message', msg => {
  if (msg.content == "!koulut") {
    msg.channel.send("Helsingin koulut: https://kaikkitietokoneista.github.io/Omenahelper/index.html")
  }
  if (msg.content.startsWith("!ruoka")) {
    var koulu = msg.content.substr("!ruoka ".length);

    console.log(koulu);

    if (koulu != "") {
      var month = date.getUTCMonth() + 1;
      //https.get('https://api.koulusafka.fi/get/index.php?a=2019-11-13&b=fgfdg905hnm490jiofsdydy346gfgd&c=' + koulu + '&tylyurl=&_=1576054557009', (resp) => {
      https.get('https://api.koulusafka.fi/get/index.php?a=' + date.getUTCFullYear() + '-' + month + '-' + date.getUTCDate() + '&b=fgfdg905hnm490jiofsdydy346gfgd&c=' + koulu + '&tylyurl=&_=1576054557009', (resp) => {
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
    } else {
      msg.reply("Et kertonut koulua (saat koulut komennolla _!koulut_)");
    }
  }
});

client.login('TOKEN_TÄHÄN');
