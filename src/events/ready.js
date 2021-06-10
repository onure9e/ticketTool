
const Discord = require("discord.js");
const ayarlar = require("../../ayarlar.json");

var prefix = ayarlar.prefix;

module.exports = client => {
  client.user.setPresence({ activity: { name: "Onurege" }, status: "dnd" });
  
  console.log(
    `BOT: Aktif, Komutlar yüklendi!`
  );
  setInterval(() => {
    client.user.setPresence({ activity: { name: "Onurege" }, status: "dnd" });
  }, 35000);
  
};

