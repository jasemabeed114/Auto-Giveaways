const Command = require("../../base/Command.js"), Discord = require("discord.js"), ms = require("ms"), axios = require("axios")

class gedit extends Command {
    constructor(client) {
        super(client, {
            name: "gedit",
        });
    }

    async run(message, args, data, language) {
        if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.youneedperm2))
        var filter = m => m.author.id === message.author.id;
        var giveawayID = args[0]
        if(!giveawayID) return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.needargs));
        const [giveaway] = await data.database.query(`SELECT * FROM giveaway WHERE id = ${giveawayID}`).catch(err => console.log(err))
        const verify = await this.client.giveawayManager.giveawayVerify(data, giveaway);
        if (verify === "time") return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.time))
        if (verify === "invalide" || verify === "end") return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.invalide))

        message.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.editoptionsgiveaway)).then(async c => {
            await c.react("👤");
            await c.react("✏️");
            await c.react("⏰");
            await c.react("📑");
            await c.react("🔊");
            await c.react("📝");
            await c.react("❌");
            const data_res = c.createReactionCollector((reaction, user) => user.id === message.author.id);
            data_res.on("collect", async (reaction) => {
                if (reaction.emoji.name === "👤") {
                    message.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.step3)).then(i => {
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 20000,
                            errors: ["time"]
                        }).then(async (collected) => {
                            var giveawaygagnant = collected.first().content
                            if (!giveawaygagnant) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step3error))
                            if (isNaN(giveawaygagnant)) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step3error))
                            if (giveawaygagnant > 10) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step3error))
                            await data.database.query(`UPDATE giveaway SET gagnant = "${giveawaygagnant}" WHERE id = "${giveawayID}"`)
                            i.delete()
                            collected.first().delete();
                            return reaction.remove(message.author.id);
                        }).catch(() => {
                            return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.timeouterror)).then(msg => msg.delete({ timeout: this.client.config.timeouterror }));
                        });
                    })
                }

                if (reaction.emoji.name === "✏️") {
                    message.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.step4)).then(i => {
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 20000,
                            errors: ["time"]
                        }).then(async (collected) => {
                            var giveawaygift = collected.first().content
                            if (!giveawaygift) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step4error))
                            if (!giveawaygift.length > 100) return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step4error))
                            await data.database.query(`UPDATE giveaway SET cadeau = "${giveawaygift}" WHERE id = "${giveawayID}"`)
                            i.delete()
                            collected.first().delete();
                            return reaction.remove(message.author.id);
                        }).catch(() => {
                            return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.timeouterror)).then(msg => msg.delete({ timeout: this.client.config.timeouterror }));
                        });
                    })
                }
                if (reaction.emoji.name === "⏰") {
                    message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step2)).then(i => {
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 20000,
                            errors: ["time"]
                        }).then(async (collected) => {
                            var giveawaytime = collected.first().content
                            if (!giveawaytime || isNaN(ms(giveawaytime))) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step2error))
                            giveawaytime = ms(giveawaytime)
                            if (giveawaytime > 864000000) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step2error))
                            await data.database.query(`UPDATE giveaway SET datenow = "${Date.now()}" WHERE id = "${giveawayID}"`)
                            await data.database.query(`UPDATE giveaway SET duration = "${giveawaytime}" WHERE id = "${giveawayID}"`)
                            await data.database.query(`UPDATE giveaway SET endTimestamp = "${Date.now() + giveawaytime}" WHERE id = "${giveawayID}"`)
                            i.delete()
                            collected.first().delete();
                            return reaction.remove(message.author.id);
                        })
                    })
                }
                if (reaction.emoji.name === "📑") {
                    message.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.optionsrole)).then(i => {
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 20000,
                            errors: ["time"]
                        }).then(async (collected) => {
                            var giveawayRole = collected.first().content
                            if (!giveawayRole) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.optionsroleerror))
                            var role = message.guild.roles.cache.find(r => r.id === giveawayRole) || message.guild.roles.cache.find(r => r.name === collected.first().content) || message.mentions.roles.first() || message.guild.roles.cache.get(giveawayRole.replace('<', '').replace('@', '').replace('&', '').replace('>', ''));
                            if (!role) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.optionsroleerror))
                            await data.database.query(`UPDATE giveaway SET rolename = "${role.name}" WHERE id = "${giveawayID}"`)
                            await data.database.query(`UPDATE giveaway SET roleid = "${role.id}" WHERE id = "${giveawayID}"`)
                            i.delete()
                            collected.first().delete();
                            return reaction.remove(message.author.id);
                        }).catch(() => {
                            return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.timeouterror)).then(msg => msg.delete({ timeout: this.client.config.timeouterror }));
                        });
                    })
                }

                if (reaction.emoji.name === "🔊") {
                    message.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.optionsvoc)).then(i => {
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 20000,
                            errors: ["time"]
                        }).then(async () => {
                            await data.database.query(`UPDATE giveaway SET voice = "1" WHERE id = "${giveawayID}"`)
                            i.delete()
                            return reaction.remove(message.author.id);
                        })
                    })
                }

                if (reaction.emoji.name === "📝") {
                    message.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.optionsmessage)).then(i => {
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 20000,
                            errors: ["time"]
                        }).then(async (collected) => {
                            var giveawaymessage = collected.first().content
                            if (!giveawaymessage || isNaN(giveawaymessage)) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.optionsmessageerror))
                            await data.database.query(`UPDATE giveaway SET message = "${giveawaymessage}" WHERE id = "${giveawayID}"`)
                            i.delete()
                            collected.first().delete();
                            return reaction.remove(message.author.id);
                        }).catch(() => {
                            return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.timeouterror)).then(msg => msg.delete({ timeout: this.client.config.timeouterror }));
                        });
                    })
                }
                if (reaction.emoji.name === "❌") {
                    c.delete(c)
                }
            })
        })
    }
}

module.exports = gedit;