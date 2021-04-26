require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios').default
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');

const token = process.env.TOKEN

const bot = new TelegramBot(token, {polling: true})

//Publish as an API
async function getSchools() {
  try {
    return axios.get('https://api.koulusafka.fi/info/schools.php').then(schools => { return schools })
  } catch (error) {
    console.error(error)
    return error
  }
}

async function getFood(schoolId) {
  try {
    const today = moment().format('YYYY-MM-DD');
    return axios.get(`https://api.koulusafka.fi/get/index.php?a=${today}&b=fgfdg905hnm490jiofsdydy346gfgd&c=${schoolId}`)
      .then(function (response) {
        return response.data
      })
  } catch (error) {
    console.error(error)
    return error
  }
}

function saveFood(day, schoolId, lunch, vege) {
  db.run(`INSERT OR IGNORE INTO foods(day, schoolid, lunch, vege) VALUES(?, ?, ?, ?)`, [day, schoolId, lunch, vege], function(err) {
    if (err) {
      return console.log(err.message);
    }

    console.log(`A new food item has been saved for day ${day} in school ${schoolId} with rowid ${this.lastID}`);
  });
}

let db = new sqlite3.Database('./data.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');

  //Improve schema
  db.run('CREATE TABLE IF NOT EXISTS schools (name text, id text, region text, UNIQUE(name, id, region))');
  db.run('CREATE TABLE IF NOT EXISTS subscriptions (tgid int, schoolid text)');
  //Fix scheme with day
  db.run('CREATE TABLE IF NOT EXISTS foods (day text, schoolid text, lunch text, vege text, UNIQUE(day))');


  getSchools().then(function(schools) {
    schools.data.regions.forEach(region => {
      region.values.forEach(school => {
        db.run(`INSERT OR IGNORE INTO schools(name, id, region) VALUES(?, ?, ?)`, [school.name, school.id, region.name], function(err) {
          if (err) {
            return console.log(err.message);
          }

          console.log(`A new school has been inserted with rowid ${this.lastID}`);
        });
      });
    });
  });
});


//Coming soon...
bot.onText(/\/koulu (.+)/, (msg, match) => {
  const chatId = msg.chat.id
  const school = match[1]
  
  bot.sendMessage(chatId, resp)
})

bot.onText(/\/tilaa (.+)/, (msg, match) => {
  const chatId = msg.chat.id
  const school = match[1]

  let sql = `SELECT name, id FROM schools WHERE name LIKE ? LIMIT 1`;

  let foundMsg = ""

  db.all(sql, ["%" + school + "%"], (err, schools) => {
    if (err) throw err;

    let sql = `SELECT schoolid FROM subscriptions WHERE tgid = ?`

    db.get(sql, [chatId], (err, row) => {
      if (err) throw err;
      if (row) {
        schools.forEach((school) => {
          let sql = `UPDATE subscriptions
              SET schoolid = ?
              WHERE tgid = ?`;

          db.run(sql, [school.id, chatId], function(err) {
            if (err) {
              return console.error(err.message);
            }
            console.log(`Row(s) updated: ${this.changes}`);
            bot.sendMessage(chatId, `<b>Tilausta päivitetty:</b><i> ${school.name}</i>`, {parse_mode : "HTML"})
          });
        });
      } else {
        schools.forEach((school) => {
          db.run(`INSERT INTO subscriptions(tgid, schoolid) VALUES(?, ?)`, [chatId, school.id], function(err) {
            if (err) {
              return console.log(err.message);
            }
    
            console.log(`A new subscription has been inserted with rowid ${this.lastID}`);
            bot.sendMessage(chatId, `<b>Tilattu:</b><i> ${school.name}</i>`, {parse_mode : "HTML"})
          });
        });    
      }
    });
  });
})

bot.onText(/\/hae (.+)/, (msg, match) => {
  const chatId = msg.chat.id
  const school = match[1]

  let sql = `SELECT name FROM schools WHERE name LIKE ? LIMIT 5`;

  let foundMsg = ""

  db.all(sql, ["%" + school + "%"], (err, rows) => {
    if (err) throw err;

    rows.forEach((row) => {
      console.log(row.name);
      foundMsg += `\n<i>${row.name}</i>`
    });

    bot.sendMessage(chatId, `<b>Löytyi:</b>\n ${foundMsg}`, {parse_mode : "HTML"})
  });
})


bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id
  
  let sql = `SELECT schoolid FROM subscriptions WHERE tgid = ?`;

  db.get(sql, [chatId], (err, row) => {
    if (err) throw err;
    if (row) {
      let foodMsg = ""
      getFood(row.schoolid).then(function(schoolFood) {
        schoolFood.foods.forEach(food => {
          foodMsg += `\n<b>${food.weekday}</b>: <code>${food.lunch}</code>`
          //Utilize db with already queried food... do not just save things there...
          saveFood(food.date, row.schoolid, food.lunch, food.vege)
        });
        bot.sendMessage(chatId, `<b>Ruoka:</b>\n${foodMsg}`, {parse_mode : "HTML"})
      })
    }
  })
})
