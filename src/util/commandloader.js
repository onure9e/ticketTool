const Discord = require('discord.js')
const fs = require('fs')
module.exports.run = (client) => {
global.commands = new Discord.Collection();
global.aliases = new Discord.Collection();
fs.readdir('./server/', (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
      if(!f.endsWith('.js'))return console.error(`${f}, Komutunun Sonu .js Olmadığı için Es Geçtim`)
        let onurege = require(`../server/${f}`);
      if(!onurege.help) return console.error(`${f}, Komutun => exports.help = {} <= Kısmı yok.`)
      global.commands.set(onurege.help.name, onurege);
        onurege.help.aliases.forEach(alias => {
          global.aliases.set(alias, onurege.help.name);
        });
    });
  console.log(`${global.commands.size} Komut ve ${global.aliases.size} Alternatif Komut yüklendi.`)//help
});



}
