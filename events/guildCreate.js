const Discord = require("discord.js");

module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run(guild) {
        await this.client.findOrCreateGuild(guild.id);
    }
};  
