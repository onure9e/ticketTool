const { MessageEmbed, Message } = require('discord.js')
var {Database} = require('nukleon'),db = new Database('Onurege.json')
exports.run = async(client, message, args) => {
    if(!message.member.hasPermission(8)) return message.reply(new MessageEmbed()
    .setDescription('Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın.'))
    if(!message.guild.me.hasPermission(8)) return message.reply(new MessageEmbed()
    .setDescription('Bu komutu çalıştırabilmem için `Yönetici` yetkimin olması lazım.'))
    var channel = message.mentions.channels.first()
    if(!channel) return message.reply(new MessageEmbed()
    .setDescription(`Lütfen bir kanal gir.
    
    Doğru Kullanım: ${require('../../ayarlar.json').prefix}ticket-kur #ticket`))
    var embed = new MessageEmbed()
    .setDescription("Destek talebi oluşturmak için 🎫 emojisine tıkla.")
    channel.send({embed:embed}).then(m=>{
        m.react("🎫")

            db.set(`${message.guild.id}.ticket`,m.id)
        

    })

}
exports.conf = {aliases: []}
exports.help = {name: "ticket-kur"};
   