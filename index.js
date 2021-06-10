const Discord = {MessageEmbed} = require('discord.js');
const client = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION"]});
const ayarlar = global.ayarlar = global.conf = client.conf = client.ayarlar = require('./ayarlar.json');
var {Database} = require('nukleon'),db = new Database('Onurege.json')
const fs = require('fs');
require('./src/util/eventLoader')(client);
var prefix = ayarlar.prefix;

const log = message => {console.log(`${message}`);};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./src/commands/', (err, files) => {
if (err) console.error(err);
log(`Toplam ${files.length} Destekçi Ve Komut Yükleniyor...`);
files.forEach(f => {
let props = require(`./src/commands/${f}`);
log(`BOT | ${props.help.name} Komutu Yüklendi.`);
client.commands.set(props.help.name, props);
props.conf.aliases.forEach(alias => {client.aliases.set(alias, props.help.name);});});});

client.reload = command => {return new Promise((resolve, reject) => {try {delete require.cache[require.resolve(`./src/commands/${command}`)];
let cmd = require(`./src/commands${command}`);
client.commands.delete(command);
client.aliases.forEach((cmd, alias) => {if (cmd === command) client.aliases.delete(alias);});
client.commands.set(command, cmd);
cmd.conf.aliases.forEach(alias => {client.aliases.set(alias, cmd.help.name);});resolve();} catch (e) {reject(e);}});};

client.load = command => {return new Promise((resolve, reject) => {try {let cmd = require(`./src/commands/${command}`);
client.commands.set(command, cmd);
cmd.conf.aliases.forEach(alias => {client.aliases.set(alias, cmd.help.name);});resolve();} catch (e) {reject(e);}});};

client.unload = command => { return new Promise((resolve, reject) => { try {delete require.cache[require.resolve(`./src/commands/${command}`)];
let cmd = require(`./src/commands/${command}`);
client.commands.delete(command);
client.aliases.forEach((cmd, alias) => {if (cmd === command) client.aliases.delete(alias);});resolve();} catch (e) {reject(e);}});};




client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;
    if(!db.fetch(`${reaction.message.guild.id}.ticket`)) return;
    let ticketMessage = db.fetch(`${reaction.message.guild.id}.ticket`);

    if(!ticketMessage) return;

    if(reaction.message.id == ticketMessage && reaction.emoji.name == '🎫') {
        reaction.users.remove(user);
        if(db.has(`ticket.${user.id}`) === true) return reaction.message.channel.send(`${user} senin aktif bir destek talebin var <#${db.get(`ticket.${user.id}`).channel}>`).then(x=>x.delete({timeout:5000}))
        
        reaction.message.guild.channels.create(`ticket-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                },
            ],
            type: 'text'
        }).then(async channel => {
            var embed = new MessageEmbed()
            .setDescription('Talebi kapatmak için ✅ emojisine tıklayınız.')
            channel.send(`${user}`,embed).then(msg=>{
                msg.pin()
                db.set(`ticket.${user.id}`,{message:msg.id,channel:channel.id})
                msg.react('✅')
            })
               })
    }
});


client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = db.fetch(`ticket.${user.id}`)

    if(!ticketid) return;

    if(reaction.message.id == ticketid.message && reaction.emoji.name == '✅') {
        db.remove(`ticket.${user.id}`);
        reaction.message.channel.send(`Bu kanal 10 saniye sonra silinecek.`)
        var interval = setInterval(function(){
            reaction.message.channel.delete()
            clearInterval(interval)
        },10000)
        

    }
});

client.login(ayarlar.token);



