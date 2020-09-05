const Telegramtgbot = require('node-telegram-bot-api');
const request = require('request');
const moment = require('moment');
const fs = require('fs');
const ICAL = require('ical.js');
const discord = require('discord.js');
const levenshtein = require('js-levenshtein');
const weather = require('openweather-apis');
const Searxuser = require('searx-api');
//const NodeCache = require( "node-cache" );
const SteamAPI = require('steamapi');

//const cache = new NodeCache();
const config = JSON.parse(fs.readFileSync('./data/config.json'))

weather.setLang('fi');
weather.setUnits('metric');
weather.setAPPID(config.weather.key);

const steam = new SteamAPI(config.steam.key);

const searx = new Searxuser(
  config.hakukone.url, //Url
  config.hakukone.protocol, //Protocol
  'fi-FI', //Language
  '1' //Safe search
)

// MUUTTUJAT
const paivat = ["<b>Ma:</b>", "<b>Ti:</b>", "<b>Ke:</b>", "<b>To:</b>", "<b>Pe:</b>"];
const paivatdc = ["Ma:", "Ti:", "Ke:", "To:", "Pe:"];
const koulut = ['Aleksis_Kiven_peruskoulu','Alppilan_lukio','Alppilan_ylaaste','Arabian_peruskoulu','Arabias_kvartersskola','Auringonpilkku,_sivukoulu','Aurinkolahden_peruskoulu','Botby_grundskola','Brahenpuiston_koulu','Brando_lagstadieskola,_gymnasium','Cygnaeus_lagstadieskola','Degero_lagstadieskola','Drumso_lagstadieskola','Elaintarhan_ala-asteen_koulu','Etu-Toolon_lukio','Grundskolan_Norsen','Helsingin_Kielilukio','Helsingin_Kuvataidelukio','Helsingin_Luonnontiedelukio','Helsingin_Medialukio','Hertsikan_ala-asteen_koulu,_Ahmatien_toimipiste','Hertsikan_ala-asteen_koulu,_Hillerikujan_toimipiste','Herttoniemen_yhteiskoulu','Herttoniemenrannan_ala-asteen_koulu','Hietakummun_ala-asteen_koulu','Hiidenkiven_peruskoulu','Hoplaxskolan_Karbole_1-6','Hoplaxskolan_Munksnas_0-6','Hoplaxskolan_Munksnas_7-9','Hoplaxskolan_Sockenbacka_1-2','Itakeskuksen_peruskoulu','Jakomaen_peruskoulu','Jatkasaaren_peruskoulu','Kaisaniemen_ala-asteen_koulu','Kalasataman_peruskoulu','Kallion_ala-asteen_koulu','Kallion_lukio','Kanava_sivukoulu','Kannelmaen_peruskoulu_Kaarelan_raitti','Kannelmaen_peruskoulu_Kanneltie','Kannelmaen_peruskoulu_Runonlaulajantien_toimipiste','Karviaistien_koulu','Katajanokan_ala-asteen_koulu','Keinutien_ala-asteen_koulu','Kontulan_ala-asteen_koulu','Koskelan_ala-asteen_koulu','Kottby_lagstadieskola','Kronohagens_lagstadieskola','Kruunuhaan_ylaasteen_koulu','Kulosaaren_ala-asteen_koulu','Kapylan_peruskoulu_Hykkyla','Kapylan_peruskoulu_Untamo','Laajasalon_peruskoulu_alatalo','Laajasalon_peruskoulu_ylatalo','Laakavuoren_ala-asteen_koulu','Latokartanon_peruskoulu','Latokartanon_peruskoulu_sivutoimipiste_Leskirouva_Freytaginkuja','Lauttasaaren_ala-aste,_Hedengrenin_toimipiste','Lauttasaaren_ala-asteen_koulu','Lansi-Pasilan_ala-asteen_koulu','Maatullin_ala-asteen_koulu','Malmin_peruskoulu_Kesala','Malmin_peruskoulu_Pohjola','Malmin_peruskoulu_Talvela','Malminkartanon_ala-asteen_koulu','Maunulan_ala-asteen_koulu','Meilahden_ala-asteen_koulu','Meilahden_ylaasteen_koulu','Mellunmaen_ala-asteen_koulu','Merilahden_pk_Jaluspolun_toimipiste','Merilahden_pk_Kallvikinniementien_toimipiste','Metsolan_ala-asteen_koulu_Ita-Pakilan_toimipiste','Metsolan_ala-asteen_koulu_Metsolan_toimipiste','Minervaskolan','Munkkiniemen_ala-asteen_koulu','Munkkiniemen_ala-asteen_koulu_Lehtisaaren_sivukoulu','Munkkivuoren_ala-asteen_koulu','Myllypuron_ala-asteen_koulu_korttelikoulu','Myllypuron_ala-asteen_koulu_paakoulu','Myllypuron_ylaasteen_koulu','Mansas_lagstadieskola','Makelanrinteen_lukio','Nallin_sivukoulu','Naulakallion_koulu','Nordsjo_lagstadieskola','Oulunkylan_ala-asteen_koulu','Oulunkylan_ala-asteen_koulu_Puukoulu','Oulunkylan_ala-asteen_koulu_Verajalaakson_sivukoulu','Pajalahden_koulu','Pakilan_ala-asteen_koulu','Pakilan_ylaasteen_koulu','Paloheinan_ala-asteen_koulu','Pihkapuiston_ala-asteen_koulu','Pihlajamaen_ala-asteen_koulu','Pihlajiston_ala-asteen_koulu','Pihlajiston_ala-asteen_koulu_Viikinmaen_sivupiste','Pikku_Huopalahden_ala-asteen_koulu','Pohjois-Haagan_ala-asteen_koulu','Poikkilaakson_ala-asteen_koulu','Porolahden_peruskoulu_Paasitie','Porolahden_peruskoulu_Roihuvuorentie','Porolahden_peruskoulu_Satumaanpolku','Porolahden_peruskoulu_Stromsinlahdenpolku','Puistolan_peruskoulu','Puistolanraitin_ala-asteen_koulu,_Nurkkatien_toimipiste','Puistolanraitin_ala-asteen_koulu,_Puistolanraitin_toimipiste','Puistopolun_pk_alapuisto','Puistopolun_pk_ylapuisto','Pukinmaenkaaren_peruskoulu_Immolantie','Pukinmaenkaaren_peruskoulu_Kenttakuja','Pukinmaenkaaren_peruskoulu_Kenttapolku','Puotilan_ala-asteen_koulu','Ressun_lukio','Ressun_peruskoulu','Roihuvuoren_ala-asteen_koulu','Roihuvuoren_ala-asteen_koulu_Marjaniemen_sivukoulu','Ruoholahden_ala-asteen_koulu','Santahaminan_ala-asteen_koulu','Sibelius_lukio','Siltamaen_ala-asteen_koulu','Snellmanin_ala-asteen_koulu','Solakallion_koulu','Sophie_Mannerheim_koulu_Nordenskioldinkadun_yksikko','Stadin_ammattiopisto_Kullervonkatu','Stadin_ammattiopisto_Latokartanontie','Stadin_ammattiopisto_Meritalo','Stadin_ammattiopisto_Muotoilijankatu','Stadin_ammattiopisto_Nilsiankatu','Stadin_ammattiopisto_Savonkatu','Stadin_ammattiopisto_Sturenkatu','Stadin_ammattiopisto_Vilppulantie','Stadin_ammattiopisto_Vuokkiniemenkatu','Staffansby_lagstadieskola','Suomenlinnan_ala-asteen_koulu','Suutarilan_ala-asteen_koulu','Suutarinkylan_peruskoulu_alakoulu','Suutarinkylan_peruskoulu_ylakoulu','Tahvonlahden_ala-asteen_koulu','Taivallahden_peruskoulu','Tapanilan_ala-asteen_koulu','Tehtaankadun_ala-asteen_koulu','Toivolan_koulu','Torpparinmaen_peruskoulu_korttelikoulu','Torpparinmaen_peruskoulu_paakoulu','Tuorinniemen_sivukoulu','Tolo_gymnasium','Toolon_ala-asteen_koulu','Vallilan_ala-asteen_koulu_Hermannin_sivukoulu','Vallilan_ala-asteen_koulu_paakoulu','Vartiokylan_ala-asteen_koulu','Vartiokylan_ylaasteen_koulu','Vesalan_ylaasteen_koulu','Vuoniityn_peruskoulu_Heteniityntie','Vuoniityn_pk_Koukkusaarentie','Vuoniityn_pk_Venemestarintie','Vuosaaren_lukio','Vaistotila__Makipellontie','Vaistotila_Laajalahdentie','Vaistotila_Sturenkatu','Yhtenaiskoulu','Zacharias_Topeliusskolan','ashjodens_grundskola'];

// FUNKTIOT
function isValidJson(json) {
  try {
    JSON.parse(json)
  } catch (e) {
    return false
  }
  return true
}

function vertaaKoulut(nimi) {
  for (var i = 0; i < koulut.length; i++) {
    if (nimi === koulut[i]) {
      return koulut[i];
    } else {
      var mahdollisuus = levenshtein(nimi, koulut[i]);
      if (mahdollisuus < 5) {
        return koulut[i];
      }
    }
  }
}

function icontToEmoji(icon) {
  /* icon to emoji */
  if (icon == "01d") {
    return '🌞';
  }
  else if (icon == "02d" || "02n") {
    return '⛅';
  }
  else if (icon == "03d" || "03n") {
    return '☁️';
  }
  else if (icon == "04d"|| "04n") {
    return '☁️';
  }
  else if (icon == "09d" || "09n") {
    return '🌧️';
  }
  else if (icon == "10d" || "10n") {
    return '🌧️';
  }
  else if (icon == "11d" || "11n") {
    return '⛈️';
  }
  else if (icon == "13d" || "13n") {
    return '❄️';
  }
  else if (icon == "50d" || "50n") {
    return '🌫️';
  }
}

// TELEGRAM
if (config.telegram.enabled) {

  const tgtoken = config.telegram.key;

  const tgbot = new Telegramtgbot(tgtoken, {polling: true});

  //SÄÄ
  if (config.weather.enabled) {
    tgbot.onText(/\/weather (.+)/, (msg, args) => {

      weather.setCity(args[1]);
      weather.getAllWeather(function(err, json){
        if(err) throw (err);
        //console.log(json);

        if (json.cod == "429") {
          tgbot.sendMessage(msg.chat.id, "Olemme saavuttaneet maksimipyyntömme tältä minuutilta.. 😔");
        }
        if (json.cod == "404") {
          tgbot.sendMessage(msg.chat.id, "Kaupunkia ei löydy. 🧐");
        }  else {
          //var imgurl = 'http://openweathermap.org/img/w/' + json.weather[0].icon + '.png';
          //bot.sendPhoto(msg.chat.id, imgurl)
          tgbot.sendMessage(msg.chat.id, "Kaupunki: " + args[1] + "\nLämpötila: " + json.main.temp + "°C🌡\nKuvaus: " + json.weather[0].description + icontToEmoji(json.weather[0].icon) + "\nKosteus: " + json.main.humidity + "%" + "\nIlmanpaine: " + json.main.pressure + " hPa" + "\nTuuli: " + json.wind.speed + "m/s💨\nValtio: " + json.sys.country);
        }
      });
    });

    tgbot.onText(/\/weather$/, (msg) => {
      tgbot.sendMessage(msg.chat.id, "Lähetä kaupunki noudattaen syntaksia /weather Helsinki.");
    })
  }

  //HAKUKONE
  if (config.hakukone.enabled) {
    tgbot.onText(/\/hae (.+)/, (msg, args) => {
      try {
        let viesti
        args.shift()
        searx.find(args.join(" "), function(data) {
          data.results.forEach((item) => {
            viesti += `<b><a href="${item.url}">${item.title}</a></b>\n<i>${item.content}</i>\n\n`
          });
          tgbot.sendMessage(msg.chat.id, viesti.replace("undefined", ""),{
            parse_mode : "HTML",
            disable_web_page_preview: true
          });
        });
      } catch (e) {
        tgbot.sendMessage(msg.chat.id, "<b>Virhe suoritettaessa hakua</b>",{
          parse_mode : "HTML",
          disable_web_page_preview: true
        });
      }
    });
  }

  //LÄKSYT
  if (config.laksyt.enabled) {

    console.log("Läksyjen näyttäminen on käytössä.")

    tgbot.onText(/\/laksyt$/, (msg, args) => {
      request(config.laksyt.url, {
        method: "GET",
        followAllRedirects: true,
        auth: {
          user: config.laksyt.username,
          pass: config.laksyt.password
        }
      }, function (error, response, kalenteridata) {
        let date = new Date()
        let viesti = ''
        let tehtavat = []

        try {
          let jcalData = ICAL.parse(kalenteridata)
          let vcalendar = new ICAL.Component(jcalData)
          let vtodos = vcalendar.getAllSubcomponents('vtodo')
          viesti += '<b>Tehtävät: </b>\n\n'

          vtodos.forEach((vtodo) => {
            let summary = vtodo.getFirstPropertyValue('summary')
            let description = vtodo.getFirstPropertyValue('description')
            let due = vtodo.getFirstPropertyValue('due')
            let duetimestamp = new Date(due.toString()).getTime()

            if (duetimestamp > date.getTime()) {
              tehtavat.push({summary: summary, description: description, due: due, duetimestamp: duetimestamp})
            }
          });

          tehtavat.sort((a, b) => a.duetimestamp - b.duetimestamp)

          tehtavat.forEach(({summary, description, due, duetimestamp}, i) => {
            viesti += `<b>${summary} (</b><i>${moment.unix(duetimestamp/1000).locale('fi').format('LL')}</i><b>)</b>:\n<code>${description}</code>\n`
          });

//          success = myCache.set( "läksyt", {
//            viesti: viesti
//          }, 43200 )
        } catch (e) {
          console.log(e);
          viesti += 'Jotakin meni pieleen. Yritä myöhemmin uudestaan. Ota tarvittaessa yhteyttä ylläpitoon.'
        } finally {
          tgbot.sendMessage(msg.chat.id, viesti, {
            parse_mode: "HTML"
          })
        }
      })
    })
  }

  // STEAM
  if (config.steam.enabled) {
    tgbot.onText(/\/steam (.+)/, (msg, args) => {

      const nameorid = args[1]; 

      if (nameorid === nameorid.match(/[0-9]/i)) {
        let id = nameorid
        steam.getUserBans(id).then(bans => {
          steam.getUserLevel(id).then(level => {
            steam.getUserRecentGames(id).then(recgames => {
              steam.getUserSummary(id).then(summary => {
                tgbot.sendMessage(msg.chat.id, `
                <b>Steam-tilin ${name} tiedot:</b>
    
    SteamID: <code>${summary.steamID}</code>
    Taso: <code>${level}</code>
    Viimeisin uloskirjautuminen: <code>${moment.unix(summary.lastLogOff).toLocaleString()}</code>
    Luotu: <code>${moment.unix(summary.created).toLocaleString()}</code>
    URL: <a href="${summary.url}">${summary.url}</a>
    VAC Bans: <code>${bans.vacBans}</code>
    Game Bans: <code>${bans.gameBans}</code>
    <i>Viimeisestä bannistä on ${bans.daysSinceLastBan} päivää</i>
    Viimeisin pelattu peli: <code>${recgames[0].name}</code>
                `,{parse_mode : "HTML"})
              })
            })
          })
        })
      } else {
        let name = nameorid
        steam.resolve(`https://steamcommunity.com/id/${name}`).then(id => {
          steam.getUserBans(id).then(bans => {
            steam.getUserLevel(id).then(level => {
              steam.getUserRecentGames(id).then(recgames => {
                steam.getUserSummary(id).then(summary => {
                  tgbot.sendMessage(msg.chat.id, `
                  <b>Steam-tilin ${name} tiedot:</b>
      
      SteamID: <code>${summary.steamID}</code>
      Taso: <code>${level}</code>
      Viimeisin uloskirjautuminen: <code>${moment.unix(summary.lastLogOff).toLocaleString()}</code>
      Luotu: <code>${moment.unix(summary.created).toLocaleString()}</code>
      URL: <a href="${summary.url}">${summary.url}</a>
      VAC Bans: <code>${bans.vacBans}</code>
      Game Bans: <code>${bans.gameBans}</code>
      <i>Viimeisestä bannistä on ${bans.daysSinceLastBan} päivää</i>
      Viimeisin pelattu peli: <code>${recgames[0].name}</code>
                  `,{parse_mode : "HTML"});
                })
              })
            })
          })
        })
      }
    })
  
    tgbot.onText(/\/steam$/, (msg) => {
      tgbot.sendMessage(msg.chat.id, `Sinun tulee antaa komennon jäkeen Steam-käyttäjänimi tai ID.`)
    })
  }

  //RUOKA

  ///ruoka 2019-08-11
  tgbot.onText(/\/ruoka (.+)/, (msg, lisä) => {
    let date = new Date();
    let time = lisä[1];
    let formattedday = moment(time);

    //https://api.koulusafka.fi/get/index.php?a=2019-12-11&b=fgfdg905hnm490jiofsdydy346gfgd&c=Aurinkolahden_peruskoulu&tylyurl=&_=1576054557009
    request(`https://api.koulusafka.fi/get/index.php?a=${time}&b=fgfdg905hnm490jiofsdydy346gfgd&c=Aurinkolahden_peruskoulu&tylyurl=&_=1576054557009`, function (error, response, body) {
      if (isValidJson(body)) {
        jsondata = JSON.parse(body);

        var viesti = "<i>Ruokana on (vko " + formattedday.week() + "):</i>\n\n";
        jsondata.foods.forEach(function(element, index){
          viesti += paivat[index] + " <code>" + element.lunch + "</code>\n";
        });
      } else {
        console.log("Error " + error);
        viesti = "Virheellinen päivämäärä\n"
      }

      tgbot.sendMessage(msg.chat.id, viesti, {
        parse_mode: "HTML"
      })
    });
  });

  tgbot.onText(/\/ruoka/, (msg, lisä) => {
    let date = new Date();
    let time = lisä[1];
    let formattedday = moment(date);

    //https://api.koulusafka.fi/get/index.php?a=2019-12-11&b=fgfdg905hnm490jiofsdydy346gfgd&c=Aurinkolahden_peruskoulu&tylyurl=&_=1576054557009
    request(`https://api.koulusafka.fi/get/index.php?a=${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}&b=fgfdg905hnm490jiofsdydy346gfgd&c=Aurinkolahden_peruskoulu&tylyurl=&_=1576054557009`, function (error, response, body) {
      if (isValidJson(body)) {
        jsondata = JSON.parse(body);

        var viesti = "<i>Ruokana on (vko " + formattedday.week() + "):</i>\n\n";
        jsondata.foods.forEach(function(element, index){
          viesti += paivat[index] + " <code>" + element.lunch + "</code>\n";
        });
      } else {
        console.log("Error " + error);
        viesti = "Virheellinen päivämäärä\n"
      }

      tgbot.sendMessage(msg.chat.id, viesti, {
        parse_mode: "HTML"
      })
    });
  });

  //TUKI
  tgbot.on('message', (msg) => {
      if (msg.text.toString().toLowerCase().includes("/start" || msg.text.toString().toLowerCase() == "/start@omenahelper_tgbot")) {
          tgbot.sendMessage(msg.chat.id, "Yleinen tukibotti lähes kaikkeen.\n\nTekijänä t.me/roysuomi\nGithub: github.com/kaikkitietokoneista/omenahelper\nKrediitit Roylle\n\nViesti /omena auttaa sinua käytön kanssa.")
      }
      else if (msg.text.toString().toLowerCase().includes("/omena" || msg.text.toString().toLowerCase() == "/omena@omenahelper_tgbot")) {
        tgbot.sendMessage(msg.chat.id, `Osaan auttaa sinua Telegrammissa muutaman asian kanssa: \n\n1. Läksyjen:\n\t<code>/laksyt</code>\n\t<code>/laksyt kaikki</code>\n\t<code>/laksyt menneet</code>\n2. ja ruuan\n\t<code>/ruoka</code>\n\t<code>/ruoka 2019-08-11</code>\n3. sekä sään\n\t<code>/weather</code>\n\t<code>/weather Helsinki</code>\n4. että tiedonhaun\n\t<code>/hae Kaikkitietokoneista</code>\n5. kuten myös Steam-tilien\n\t<code>/steam Tilinimi</code>`, {
          parse_mode: "HTML"
        })
      }
  });

  console.log("Telegram on käytössä. Voit muokata tätä konfigurointietiedostossa (data/config.json).");
} else {
  console.log("Telegram on poissa käytöstä. Voit muokata tätä konfigurointietiedostossa (data/config.json).");
}

// DISCORD
if (config.discord.enabled) {
  const dcbot = new discord.Client();

  dcbot.on('ready', () => {
    console.log("Kirjauduttu " + dcbot.user.tag);
    //dcbot.user.setGame('Tarvitsetko apua? Lähetä: !omena')
    dcbot.user.setActivity("Tarvitsetko apua? Lähetä: !omena", {
      type: "PLAYING"
    });
  });

  dcbot.on('message', msg => {
    //RUOKA KOULUT
    if (msg.content == "!koulut") {
      msg.channel.send("Helsingin koulut: https://kaikkitietokoneista.github.io/Omenahelper/index.html")
    }
    //RUOKA
    if (msg.content.startsWith("!ruoka")) {
      let koulu = msg.content.substr("!ruoka ".length);

      if (koulu != "") {
        let etsittykoulu = vertaaKoulut(koulu);
        let date = new Date();
        let formattedday = moment(date);
        let viesti;

        //https://api.koulusafka.fi/get/index.php?a=2019-12-11&b=fgfdg905hnm490jiofsdydy346gfgd&c=Aurinkolahden_peruskoulu&tylyurl=&_=1576054557009
        request(`https://api.koulusafka.fi/get/index.php?a=${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}&b=fgfdg905hnm490jiofsdydy346gfgd&c=Aurinkolahden_peruskoulu&tylyurl=&_=1576054557009`, function (error, response, body) {
          if (isValidJson(body)) {
            jsondata = JSON.parse(body);

            var viesti = "Ruokana on " + etsittykoulu + ":ssa (vko " + formattedday.week() + "):\n\n";
            jsondata.foods.forEach(function(element, index){
              viesti += paivatdc[index] + " " + element.lunch + "\n";
            });
          } else {
            console.log("Error " + error);
            viesti = "Virheellinen päivämäärä\n"
          }

          viesti += "\nTekijänä @Erikoisjääkäri#0939";
          msg.reply(viesti);
        });
      } else {
        msg.reply("Et kertonut koulua (saat koulut komennolla _!koulut_)");
      }
    }
    //LÄKSYT
    else if (msg.content.startsWith("!läksyt") && config.laksyt.enabled) {
      request(config.laksyt.url, {
        method: "GET",
        followAllRedirects: true,
        auth: {
          user: config.laksyt.username,
          pass: config.laksyt.password
        }
      }, function (error, response, kalenteridata) {
        let date = new Date()
        let viesti = ''
        let tehtavat = []

        try {
          let jcalData = ICAL.parse(kalenteridata)
          let vcalendar = new ICAL.Component(jcalData)
          let vtodos = vcalendar.getAllSubcomponents('vtodo')
          viesti += '**Tehtävät: **\n\n'

          vtodos.forEach((vtodo, i) => {
            let summary = vtodo.getFirstPropertyValue('summary')
            let description = vtodo.getFirstPropertyValue('description')
            let due = vtodo.getFirstPropertyValue('due')
            let duetimestamp = new Date(due.toString()).getTime()

            if (duetimestamp > date.getTime()) {
              tehtavat.push({summary: summary, description: description, due: due, duetimestamp: duetimestamp})
            }
          });

          tehtavat.sort((a, b) => a.duetimestamp - b.duetimestamp)

          tehtavat.forEach(({summary, description, due, duetimestamp}, i) => {
            viesti += `**${summary} (**_${moment.unix(duetimestamp/1000).locale('fi').format('LL')}_**)**:\n\`\`\`${description} \`\`\`\n`
          });
        } catch (e) {
          console.log(e);
          viesti += 'Jotakin meni pieleen. Yritä myöhemmin uudestaan. Ota tarvittaessa yhteyttä ylläpitoon.'
        } finally {
          msg.reply(viesti)
        }
      })
    }
    //LÄKSYT
    else if (msg.content.startsWith("!läksyt") && config.laksyt.enabled) {
      request(config.laksyt.url, {
        method: "GET",
        followAllRedirects: true,
        auth: {
          user: config.laksyt.username,
          pass: config.laksyt.password
        }
      }, function (error, response, kalenteridata) {
        let date = new Date()
        let viesti = ''
        let tehtavat = []

        try {
          let jcalData = ICAL.parse(kalenteridata)
          let vcalendar = new ICAL.Component(jcalData)
          let vtodos = vcalendar.getAllSubcomponents('vtodo')
          viesti += '<b>Tehtävät: </b>\n\n'

          vtodos.forEach((vtodo) => {
            let summary = vtodo.getFirstPropertyValue('summary')
            let description = vtodo.getFirstPropertyValue('description')
            let due = vtodo.getFirstPropertyValue('due')
            let duetimestamp = new Date(due.toString()).getTime()

            if (duetimestamp > date.getTime()) {
              tehtavat.push({summary: summary, description: description, due: due, duetimestamp: duetimestamp})
            }
          });

          tehtavat.sort((a, b) => a.duetimestamp - b.duetimestamp)

          tehtavat.forEach(({summary, description, due, duetimestamp}, i) => {
            viesti += `<b>${summary} (</b><i>${moment.unix(duetimestamp/1000).locale('fi').format('LL')}</i><b>)</b>:\n<code>${description}</code>\n`
          });
        } catch (e) {
          console.log(e);
          viesti += 'Jotakin meni pieleen. Yritä myöhemmin uudestaan. Ota tarvittaessa yhteyttä ylläpitoon.'
        } finally {
          msg.reply(viesti)
        }
      })
    }
    //HAKUKONE
    else if (msg.content.startsWith("!hae") && config.hakukone.enabled) {
      try {
        let args = msg.content.split(' ')
        let viesti
        args.shift()
        searx.find(args.join(" "), function(data) {
          data.results.forEach((item, i) => {
            if (i < 5) {
              viesti += `**[${item.url}](${item.title})**\n_${item.content}_\n\n`
            }
          });
          msg.reply(viesti.replace("undefined", ""));
        });
      } catch (e) {
        msg.reply("Jotakin meni pahasti pieleen")
      }
    }
    //SÄÄ
    else if (msg.content.startsWith("!sää") && config.weather.enabled) {
      let koulu = msg.content.split(' ')[1]
      if (koulu) {
        weather.setCity(koulu);
        weather.getAllWeather(function(err, json){
          if(err) throw (err);
          //console.log(json);

          if (json.cod == "429") {
            msg.reply("Olemme saavuttaneet maksimipyyntömme tältä minuutilta.. 😔");
          }
          if (json.cod == "404") {
            msg.reply("Kaupunkia ei löydy. 🧐");
          }  else {
            //var imgurl = 'http://openweathermap.org/img/w/' + json.weather[0].icon + '.png';
            //bot.sendPhoto(msg.chat.id, imgurl)
            msg.reply("Kaupunki: " + koulu + "\nLämpötila: " + json.main.temp + "°C🌡\nKuvaus: " + json.weather[0].description + icontToEmoji(json.weather[0].icon) + "\nKosteus: " + json.main.humidity + "%" + "\nIlmanpaine: " + json.main.pressure + " hPa" + "\nTuuli: " + json.wind.speed + "m/s💨\nValtio: " + json.sys.country);
          }
        });
      } else {
        msg.reply("Lähetä kaupunki noudattaen syntaksia !sää Helsinki")
      }
    }
    // STEAM
    else if (msg.content.startsWith("!steam") && config.steam.enabled) {
      let nameorid = msg.content.split(' ')[1]

      if (nameorid) {
        if (nameorid === nameorid.match(/[0-9]/i)) {
          let id = nameorid
          steam.getUserBans(id).then(bans => {
            steam.getUserLevel(id).then(level => {
              steam.getUserRecentGames(id).then(recgames => {
                steam.getUserSummary(id).then(summary => {
                  msg.reply(`
                  **Steam-tilin ${name} tiedot:**

SteamID: \`\`\`${summary.steamID}\`\`\`
Taso: \`\`\`${level}\`\`\`
Viimeisin uloskirjautuminen: \`\`\`${moment.unix(summary.lastLogOff).toLocaleString()}\`\`\`
Luotu: \`\`\`${moment.unix(summary.created).toLocaleString()}\`\`\`
URL: "${summary.url}"
VAC Bans: \`\`\`${bans.vacBans}\`\`\`
Game Bans: \`\`\`${bans.gameBans}\`\`\`
_Viimeisestä bannistä on ${bans.daysSinceLastBan} päivää_
Viimeisin pelattu peli: \`\`\`${recgames[0].name}\`\`\`
                  `);
                })
              })
            })
          })
        } else {
          let name = nameorid
          steam.resolve(`https://steamcommunity.com/id/${name}`).then(id => {
            steam.getUserBans(id).then(bans => {
              steam.getUserLevel(id).then(level => {
                steam.getUserRecentGames(id).then(recgames => {
                  steam.getUserSummary(id).then(summary => {
                    msg.reply(`
                    **Steam-tilin ${name} tiedot:**

SteamID: \`\`\`${summary.steamID}\`\`\`
Taso: \`\`\`${level}\`\`\`
Viimeisin uloskirjautuminen: \`\`\`${moment.unix(summary.lastLogOff).toLocaleString()}\`\`\`
Luotu: \`\`\`${moment.unix(summary.created).toLocaleString()}\`\`\`
URL: "${summary.url}"
VAC Bans: \`\`\`${bans.vacBans}\`\`\`
Game Bans: \`\`\`${bans.gameBans}\`\`\`
_Viimeisestä bannistä on ${bans.daysSinceLastBan} päivää_
Viimeisin pelattu peli: \`\`\`${recgames[0].name}\`\`\`
                    `);
                  })
                })
              })
            })
          })
        }  
      } else {
        msg.reply(`Sinun tulee antaa komennon jäkeen Steam-käyttäjänimi tai ID.`)
      }
    }

    //TUKI
    else if (msg.content.startsWith("!omena")) {
      msg.reply(`Osaan auttaa sinua Discordissa muutaman asian kanssa: \n`+/*\n1. Läksyjen (_!laksyt_) (Kehityksen alla)*/`\n1. ruuan (_!ruoka_)\n\t- katso koulut (_!koulut_)\n2. sään (_!sää_)\n3. tiedonhaun kanssa (_!hae jotakin_)\n4. annettujen läksyjen (_!läksyt_)\n5. steam-tilien kanssa (_!steam_)`);
    }
  });

  dcbot.login(config.discord.key);
  console.log("Discord on käytössä. Voit muokata tätä konfigurointietiedostossa (data/config.json).");
} else {
  console.log("Discord on poissa käytöstä. Voit muokata tätä konfigurointietiedostossa (data/config.json).");
}