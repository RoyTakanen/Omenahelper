const https = require('https');
const moment = require('moment');
const discord = require('discord.js');
const levenshtein = require('js-levenshtein');
const client = new discord.Client();

/* Muuttujat */
var date = new Date();

koulut = ['Aleksis_Kiven_peruskoulu','Alppilan_lukio','Alppilan_ylaaste','Arabian_peruskoulu','Arabias_kvartersskola','Auringonpilkku,_sivukoulu','Aurinkolahden_peruskoulu','Botby_grundskola','Brahenpuiston_koulu','Brando_lagstadieskola,_gymnasium','Cygnaeus_lagstadieskola','Degero_lagstadieskola','Drumso_lagstadieskola','Elaintarhan_ala-asteen_koulu','Etu-Toolon_lukio','Grundskolan_Norsen','Helsingin_Kielilukio','Helsingin_Kuvataidelukio','Helsingin_Luonnontiedelukio','Helsingin_Medialukio','Hertsikan_ala-asteen_koulu,_Ahmatien_toimipiste','Hertsikan_ala-asteen_koulu,_Hillerikujan_toimipiste','Herttoniemen_yhteiskoulu','Herttoniemenrannan_ala-asteen_koulu','Hietakummun_ala-asteen_koulu','Hiidenkiven_peruskoulu','Hoplaxskolan_Karbole_1-6','Hoplaxskolan_Munksnas_0-6','Hoplaxskolan_Munksnas_7-9','Hoplaxskolan_Sockenbacka_1-2','Itakeskuksen_peruskoulu','Jakomaen_peruskoulu','Jatkasaaren_peruskoulu','Kaisaniemen_ala-asteen_koulu','Kalasataman_peruskoulu','Kallion_ala-asteen_koulu','Kallion_lukio','Kanava_sivukoulu','Kannelmaen_peruskoulu_Kaarelan_raitti','Kannelmaen_peruskoulu_Kanneltie','Kannelmaen_peruskoulu_Runonlaulajantien_toimipiste','Karviaistien_koulu','Katajanokan_ala-asteen_koulu','Keinutien_ala-asteen_koulu','Kontulan_ala-asteen_koulu','Koskelan_ala-asteen_koulu','Kottby_lagstadieskola','Kronohagens_lagstadieskola','Kruunuhaan_ylaasteen_koulu','Kulosaaren_ala-asteen_koulu','Kapylan_peruskoulu_Hykkyla','Kapylan_peruskoulu_Untamo','Laajasalon_peruskoulu_alatalo','Laajasalon_peruskoulu_ylatalo','Laakavuoren_ala-asteen_koulu','Latokartanon_peruskoulu','Latokartanon_peruskoulu_sivutoimipiste_Leskirouva_Freytaginkuja','Lauttasaaren_ala-aste,_Hedengrenin_toimipiste','Lauttasaaren_ala-asteen_koulu','Lansi-Pasilan_ala-asteen_koulu','Maatullin_ala-asteen_koulu','Malmin_peruskoulu_Kesala','Malmin_peruskoulu_Pohjola','Malmin_peruskoulu_Talvela','Malminkartanon_ala-asteen_koulu','Maunulan_ala-asteen_koulu','Meilahden_ala-asteen_koulu','Meilahden_ylaasteen_koulu','Mellunmaen_ala-asteen_koulu','Merilahden_pk_Jaluspolun_toimipiste','Merilahden_pk_Kallvikinniementien_toimipiste','Metsolan_ala-asteen_koulu_Ita-Pakilan_toimipiste','Metsolan_ala-asteen_koulu_Metsolan_toimipiste','Minervaskolan','Munkkiniemen_ala-asteen_koulu','Munkkiniemen_ala-asteen_koulu_Lehtisaaren_sivukoulu','Munkkivuoren_ala-asteen_koulu','Myllypuron_ala-asteen_koulu_korttelikoulu','Myllypuron_ala-asteen_koulu_paakoulu','Myllypuron_ylaasteen_koulu','Mansas_lagstadieskola','Makelanrinteen_lukio','Nallin_sivukoulu','Naulakallion_koulu','Nordsjo_lagstadieskola','Oulunkylan_ala-asteen_koulu','Oulunkylan_ala-asteen_koulu_Puukoulu','Oulunkylan_ala-asteen_koulu_Verajalaakson_sivukoulu','Pajalahden_koulu','Pakilan_ala-asteen_koulu','Pakilan_ylaasteen_koulu','Paloheinan_ala-asteen_koulu','Pihkapuiston_ala-asteen_koulu','Pihlajamaen_ala-asteen_koulu','Pihlajiston_ala-asteen_koulu','Pihlajiston_ala-asteen_koulu_Viikinmaen_sivupiste','Pikku_Huopalahden_ala-asteen_koulu','Pohjois-Haagan_ala-asteen_koulu','Poikkilaakson_ala-asteen_koulu','Porolahden_peruskoulu_Paasitie','Porolahden_peruskoulu_Roihuvuorentie','Porolahden_peruskoulu_Satumaanpolku','Porolahden_peruskoulu_Stromsinlahdenpolku','Puistolan_peruskoulu','Puistolanraitin_ala-asteen_koulu,_Nurkkatien_toimipiste','Puistolanraitin_ala-asteen_koulu,_Puistolanraitin_toimipiste','Puistopolun_pk_alapuisto','Puistopolun_pk_ylapuisto','Pukinmaenkaaren_peruskoulu_Immolantie','Pukinmaenkaaren_peruskoulu_Kenttakuja','Pukinmaenkaaren_peruskoulu_Kenttapolku','Puotilan_ala-asteen_koulu','Ressun_lukio','Ressun_peruskoulu','Roihuvuoren_ala-asteen_koulu','Roihuvuoren_ala-asteen_koulu_Marjaniemen_sivukoulu','Ruoholahden_ala-asteen_koulu','Santahaminan_ala-asteen_koulu','Sibelius_lukio','Siltamaen_ala-asteen_koulu','Snellmanin_ala-asteen_koulu','Solakallion_koulu','Sophie_Mannerheim_koulu_Nordenskioldinkadun_yksikko','Stadin_ammattiopisto_Kullervonkatu','Stadin_ammattiopisto_Latokartanontie','Stadin_ammattiopisto_Meritalo','Stadin_ammattiopisto_Muotoilijankatu','Stadin_ammattiopisto_Nilsiankatu','Stadin_ammattiopisto_Savonkatu','Stadin_ammattiopisto_Sturenkatu','Stadin_ammattiopisto_Vilppulantie','Stadin_ammattiopisto_Vuokkiniemenkatu','Staffansby_lagstadieskola','Suomenlinnan_ala-asteen_koulu','Suutarilan_ala-asteen_koulu','Suutarinkylan_peruskoulu_alakoulu','Suutarinkylan_peruskoulu_ylakoulu','Tahvonlahden_ala-asteen_koulu','Taivallahden_peruskoulu','Tapanilan_ala-asteen_koulu','Tehtaankadun_ala-asteen_koulu','Toivolan_koulu','Torpparinmaen_peruskoulu_korttelikoulu','Torpparinmaen_peruskoulu_paakoulu','Tuorinniemen_sivukoulu','Tolo_gymnasium','Toolon_ala-asteen_koulu','Vallilan_ala-asteen_koulu_Hermannin_sivukoulu','Vallilan_ala-asteen_koulu_paakoulu','Vartiokylan_ala-asteen_koulu','Vartiokylan_ylaasteen_koulu','Vesalan_ylaasteen_koulu','Vuoniityn_peruskoulu_Heteniityntie','Vuoniityn_pk_Koukkusaarentie','Vuoniityn_pk_Venemestarintie','Vuosaaren_lukio','Vaistotila__Makipellontie','Vaistotila_Laajalahdentie','Vaistotila_Sturenkatu','Yhtenaiskoulu','Zacharias_Topeliusskolan','ashjodens_grundskola'];

/* Funktiot */
// Todo tee silleen että nostaa loopissa koko ajan mahdollisuus < lukua
function vertaa(nimi) {
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

client.on('ready', () => {
  console.log("Logged in as " + client.user.tag);
  client.user.setPresence({ game: { name: 'kouluruoan etsintää' }, status: 'available' }).catch(console.error);
});

client.on('message', msg => {
  if (msg.content == "!koulut") {
    msg.channel.send("Helsingin koulut: https://kaikkitietokoneista.github.io/Omenahelper/index.html")
  }
  if (msg.content.startsWith("!ruoka")) {
    var koulu = msg.content.substr("!ruoka ".length);

    if (koulu != "") {
      var month = date.getUTCMonth() + 1;
      var etsittykoulu = vertaa(koulu);
      //https.get('https://api.koulusafka.fi/get/index.php?a=2019-03-13&b=fgfdg905hnm490jiofsdydy346gfgd&c=' + etsittykoulu + '&tylyurl=&_=1576054557009', (resp) => {
      https.get('https://api.koulusafka.fi/get/index.php?a=' + date.getUTCFullYear() + '-' + month + '-' + date.getUTCDate() + '&b=fgfdg905hnm490jiofsdydy346gfgd&c=' + etsittykoulu + '&tylyurl=&_=1576054557009', (resp) => {
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

                  var viesti = "Ruokana on " + etsittykoulu + ":ssa (vko " + formattedday.week() + "):\n";
                  for (let nro = 0; nro < 5; nro++) {
                      viesti += paivat[nro] + ' ' + jsondata.foods[nro].lunch + "\n";
                  }
              } catch(error) {
                  console.log("Error " + error);
                  viesti = "Tälle viikolle ei löytynyt ruokalistaa. Tänään on " + formattedday.format("MMM Do YY"); + "\n";
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
