const Discord = require("discord.js");
const config = require("../config");

module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run(guild) {
        let res = await this.client.shard.fetchClientValues('guilds.cache.size').catch(() => undefined)
        if (res.length === config.shard) {
            await (await this.client.database()).query(`DELETE FROM guild WHERE id = "${guild.id}"`);
            await (await this.client.database()).query(`DELETE FROM guilduser WHERE serverid = "${guild.id}"`);
        }
    }
};  
