const Discord = require("discord.js");
const ms = require("ms")
const parsems = require("parse-ms");
const config = require("../config");

module.exports = {

    generateGlobalEmbedError(language) {
        let description = language
        const giveawayEmbed = new Discord.MessageEmbed()
            .setTitle(":tada: Auto'Giveaways")
            .setColor('#800000')
            .setDescription(description)
            .setFooter(config.footer)
        return giveawayEmbed
    },
    
    generateGlobalSystemEmbed(language) {
        let description = language
        const giveawayEmbed = new Discord.MessageEmbed()
            .setTitle(":tada: Auto'Giveaways")
            .setColor(config.color)
            .setDescription(description)
            .setFooter(config.footer)
        return giveawayEmbed
    },
};
