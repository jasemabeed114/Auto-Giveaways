const { getLanguage } = require("../utils/functions");
const Discord = require("discord.js");
const config = require("../config");
require('moment-duration-format')
moment = require("moment")
const axios = require("axios")

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        const data = {};
        if (message.author.bot || message.channel.type === "dm") return;

        const client = this.client;
        data.config = client.config;
        const database = await client.database();
        data.database = database;
        const user = await client.findUser(message.author.id);
        data.user = user;
        const guild = await client.findOrCreateGuild(message.guild.id);
        data.guild = guild;
        const guilduser = await client.findOrCreateUserGuild(message.author.id, message.guild.id, message.member);
        data.guilduser = guilduser;

        if (guilduser) {
            const [messagesend] = await data.database.query(`SELECT * FROM guilduser WHERE userid = "${message.author.id}" && guildid = "${message.guild.id}"`)
            await data.database.query(`UPDATE guilduser SET message = "${messagesend[0].message + 1}" WHERE userid = "${message.author.id}" && guildid = "${message.guild.id}"`)
            //const [guildmsg] = await data.database.query(`SELECT * FROM guild WHERE id = "${message.guild.id}"`)
            //if(guildmsg[0].quizzLaunched == 'yes') return;
            //await data.database.query(`UPDATE guild SET message = "${guildmsg[0].message + 1}" WHERE id = "${message.guild.id}"`)
            //if(((guildmsg[0].message + 1) % 500) == 0) {
                //this.client.events.startQuizz(this.client);
            //}
        }

        const prefix = "s."
        if(!message.content.startsWith(prefix)) return;
        
        if (message.guild) {
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
            if (cmd) {
                const user = await client.findOrCreateUser(message.author.id, message.author);
                data.user = user;
                const language = await client.functions.getLanguage(data.guild);
                data.language = language;
                if (cmd.conf.ownerOnly === true && message.author.id !== client.config.ownerID) return
                await cmd.run(message, args, data, language);
            }
        }
    }
}
