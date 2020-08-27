const Telegramtgbot = require('node-telegram-bot-api');
const request = require('request');
const moment = require('moment');
const fs = require('fs');
const ICAL = require('ical.js');
const discord = require('discord.js');
const levenshtein = require('js-levenshtein');

const config = JSON.parse(fs.readFileSync('./data/config.json'))

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

// TELEGRAM
if (config.telegram.enabled) {

  const tgtoken = config.telegram.key;

  const tgbot = new Telegramtgbot(tgtoken, {polling: true});

  //LÄKSYT
  if (config.laksyt.enabled) {

    console.log("Läksyjen näyttäminen on käytössä.")
    tgbot.onText(/\/laksyt (.+)/, (msg, args) => {
      request('https://asdew.kaikkitietokoneista.net/remote.php/dav/calendars/Erikoisjaakari/school_shared_by_Asdew?export', {
        method: "GET",
        auth: {
          user: config.laksyt.username,
          pass: config.laksyt.password
        }
      }, function (error, response, kalenteridata) {
        let date = new Date()
        let viesti = ''

        try {
          let jcalData = ICAL.parse(kalenteridata)
          let vcalendar = new ICAL.Component(jcalData)
          let vtodos = vcalendar.getAllSubcomponents('vtodo')

          vtodos.forEach((vtodo, i) => {
            let summary = vtodo.getFirstPropertyValue('summary')
            let description = vtodo.getFirstPropertyValue('description')
            let due = vtodo.getFirstPropertyValue('due')

            //console.log(new Date(due.toString()).getTime())
            if (args[1] === "tulevat") {
              if (new Date(due.toString()).getTime() > date.getTime()) {
                viesti += `<b>${summary}</b>: <i>${description}</i>\n`
              }
            } else if (args[1] === "menneet") {
              if (new Date(due.toString()).getTime() < date.getTime()) {
                viesti += `<b>${summary}</b>: <i>${description}</i>\n`
              }
            }
          })
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

        try {
          let jcalData = ICAL.parse(kalenteridata)
          let vcalendar = new ICAL.Component(jcalData)
          let vtodos = vcalendar.getAllSubcomponents('vtodo')
          viesti += '<b>Tehtävät: </b>\n\n'

          vtodos.forEach((vtodo, i) => {
            let summary = vtodo.getFirstPropertyValue('summary')
            let description = vtodo.getFirstPropertyValue('description')
            let due = vtodo.getFirstPropertyValue('due')

            if (new Date(due.toString()).getTime() > date.getTime()) {
              viesti += `<b>${summary}</b> (Tulossa): <i>${description}</i>\n`
            } else if (new Date(due.toString()).getTime() < date.getTime()) {
              viesti += `<b>${summary}</b> (Mennyt): <i>${description}</i>\n`
            }
          })
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
          tgbot.sendMessage(msg.chat.id, "Kouluruoka Aurinkolahden Peruskolussa\n\nKäyttää koulusafka.fi:n APIa\nTekijänä t.me/roysuomi\nGithub: github.com/kaikkitietokoneista/omenahelper\nKrediitit Roylle\n\n Viesti /apua kertoo kuinka tätä kuuluu käyttää.")
      }
      else if (msg.text.toString().toLowerCase().includes("/apua" || msg.text.toString().toLowerCase() == "/apua@omenahelper_tgbot")) {
          tgbot.sendMessage(msg.chat.id, "Komentosyntaksi on seuraavanlainen:\n/apua  - näyttää tämän\n/ruoka - kertoo nykyisen viikon ruoan\n/ruoka 2019-08-11 - kertoo päivämäärän viikon ruoan")
      }
  });

  console.log("Telegram on käytössä. Voit muokata tätä konfigurointietiedostossa (data/config.json).");
} else {
  console.log("Telegram on poissa käytöstä. Voit muokata tätä konfigurointietiedostossa (data/config.json).");
}

// DISCORD

if (config.telegram.enabled) {
  const dcbot = new discord.Client();

  dcbot.on('ready', () => {
    console.log("Kirjauduttu " + dcbot.user.tag);
    //dcbot.user.setGame('Tarvitsetko apua? Lähetä: !omena')
    dcbot.user.setActivity("Tarvitsetko apua? Lähetä: !omena", {
      type: "PLAYING"
    });
  });

  dcbot.on('message', msg => {
    if (msg.content == "!koulut") {
      msg.channel.send("Helsingin koulut: https://kaikkitietokoneista.github.io/Omenahelper/index.html")
    }
    if (msg.content.startsWith("!ruoka")) {
      var koulu = msg.content.substr("!ruoka ".length);

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
    } else if (msg.content.startsWith("!laksyt")) {
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

        try {
          let jcalData = ICAL.parse(kalenteridata)
          let vcalendar = new ICAL.Component(jcalData)
          let vtodos = vcalendar.getAllSubcomponents('vtodo')
          viesti += '**Tehtävät: **\n\n'

          vtodos.forEach((vtodo, i) => {
            let summary = vtodo.getFirstPropertyValue('summary')
            let description = vtodo.getFirstPropertyValue('description')
            let due = vtodo.getFirstPropertyValue('due')

            if (new Date(due.toString()).getTime() > date.getTime()) {
              viesti += `${summary} (Tulossa): _${description}_\n`
            } else if (new Date(due.toString()).getTime() < date.getTime()) {
              viesti += `${summary} (Mennyt): _${description}_\n`
            }
          })
        } catch (e) {
          console.log(e);
          viesti += 'Jotakin meni pieleen. Yritä myöhemmin uudestaan. Ota tarvittaessa yhteyttä ylläpitoon.'
        } finally {
          msg.reply(viesti);
        }
      })
    } else if (msg.content.startsWith("!omena")) {
      msg.reply(`Osaan auttaa sinua Discordissa kahden asian kanssa: \n\n1. Läksyjen (_!laksyt_)\n2. ja ruuan (_!ruoka_)\n\t- katso koulut (_!koulut_)`);
    }
  });

  dcbot.login(config.discord.key);
  console.log("Discord on käytössä. Voit muokata tätä konfigurointietiedostossa (data/config.json).");
} else {
  console.log("Discord on poissa käytöstä. Voit muokata tätä konfigurointietiedostossa (data/config.json).");
}
