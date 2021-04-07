const Discord = require("discord.js");
const ms = require('ms')

module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run(member) {
        const channel = this.client.channels.cache.get('823990630605914153')
        if(Date.now() - member.user.createdTimestamp >= 259200000) {
            channel.send(`<a:flehe:823995431108476979> Souhaitez la bienvenue à ${member}\n\n<:point:825355671499178004> Pense à prendre tes <#823990622636474418>`)
            member.send('<a:flehe:823995431108476979> Hey, bienvenue sur notre serveur. N\'hésite pas à faire un tour sur notre boutique : https://discord-eclipse.xyz/shop !').catch(err => undefined)
        } else {
            await member.send(`<a:flehe:823995431108476979> Vous avez été exclus du serveur \`${member.guild.name}\` car votre compte est trop récent. Il doit avoir été créé il y a **3 jours** ou plus.`)
            await channel.send(`<a:flehe:823995431108476979> \`${member.user.tag}\` a rejoint le serveur, mais il a été kick par notre anti-double-comptes, car son compte est trop récent.`)
            await member.kick("Anti-DC System | By JustStop__#7183");
        }

        const ch = this.client.channels.cache.get('823990618828963841');
        ch.send(`${member}`).then(m => {
            setTimeout(() => {
                m.delete();
            }, 2000)
        })
    }
};  
