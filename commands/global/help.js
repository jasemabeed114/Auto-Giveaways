const Command = require("../../base/Command.js"), Discord = require("discord.js");

class Help extends Command {

    constructor(client) {
        super(client, {
            name: "help",
        });
    }

    async run(message, args, data, language) {
        message.channel.send(this.client.globalManager.generateGlobalSystemEmbed(language.help))
    }
}

module.exports = Help;
