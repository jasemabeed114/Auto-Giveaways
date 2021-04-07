const Command = require("../../base/Command.js"), Discord = require("discord.js");
require("../../extends/inlineReply")

class Suggest extends Command {

    constructor(client) {
        super(client, {
            name: "suggest",
        });
    }

    async run(message, args, data, language) {
        if(!args[0]) return message.channel.send(this.client.globalManager.generateGlobalEmbedError(language.providesuggest));
        const channel = message.guild.channels.cache.get('823990634603741254')
        const m = await channel.send(
            new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({format: 'png', dynamic: true}))
                .setColor('#5c7aff')
                .setDescription(`Nouvelle suggestion de ${message.author}:\n\n\`\`\`diff\n+ ${args.join(' ')}\n\`\`\``)
        )
         
        const guild = this.client.guilds.cache.get('783112936611643393');
        const oui = guild.emojis.cache.get('823995446044524547')
        const non = guild.emojis.cache.get('823995445998387281')

        await m.react(oui);
        await m.react(non)

        message.inlineReply(this.client.globalManager.generateGlobalSystemEmbed(`Votre suggestion a correctement été envoyée.`))
    }
}

module.exports = Suggest;