const Command = require("../../base/Command.js"), Discord = require("discord.js"), ms = require("ms"), axios = require("axios");
class gstart extends Command {
    constructor(client) {
        super(client, {
            name: "gstart",
        });
    }

    async run(message, args, data, language) {
        if(!message.guild.id == '783112936611643393') return;
        if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.youneedperm2))
        var filter = m => m.author.id === message.author.id;
        return message.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.step1)).then(msg => {
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ["time"]
            }).then(collected => {
                var giveawayChannel = collected.first().mentions.channels.first() || message.channel
                if (!giveawayChannel || giveawayChannel.type === "voice") return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step1error));
                msg.delete()
                collected.first().delete();
                msg.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.step2)).then(msg => {
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 60000,
                        errors: ["time"]
                    }).then(collected => {
                        var giveawayDuration = collected.first().content
                        if (!giveawayDuration || isNaN(ms(giveawayDuration))) return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step2error))
                        giveawayDuration = ms(giveawayDuration)
                        if (giveawayDuration > 864000000 || giveawayDuration < 60000) return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step2error))
                        msg.delete()
                        collected.first().delete();
                        msg.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.step3)).then(msg => {
                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 60000,
                                errors: ["time"]
                            }).then(collected => {
                                var giveawayWinners = collected.first().content
                                if (isNaN(giveawayWinners)) return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step3error));
                                if (giveawayWinners > 10 || giveawayWinners < 1) return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step3error));
                                msg.delete()
                                collected.first().delete();
                                msg.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.step4)).then(msg => {
                                    message.channel.awaitMessages(filter, {
                                        max: 1,
                                        time: 60000,
                                        errors: ["time"]
                                    }).then(async (collected) => {
                                        var giveawayGift = collected.first().content;
                                        if (!giveawayGift) return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step4error))
                                        if (!giveawayGift.length > 100) return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.step4error))
                                        msg.delete()
                                        collected.first().delete();
                                        await (await this.client.database()).query(`INSERT INTO giveaway (id,serverid,authorid,channelid,cadeau,duration,gagnant,datenow, endTimestamp) VALUES ('1','${message.guild.id}','${message.author.id}','${giveawayChannel.id}',"${giveawayGift}",'${giveawayDuration}','${giveawayWinners}','${Date.now()}', '${Date.now() + giveawayDuration}')`)
                                        msg.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.options)).then(async c => {
                                            await c.react("📑");
                                            await c.react("🔊");
                                            await c.react("📝");
                                            await c.react("🎁");
                                            await c.react("❌");
                                            const data_res = c.createReactionCollector((reaction, user) => user.id === message.author.id);
                                            data_res.on("collect", async (reaction) => {
                                                if (reaction.emoji.name === "📝") {
                                                    c.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.optionsmessage)).then(i => {
                                                        message.channel.awaitMessages(filter, {
                                                            max: 1,
                                                            time: 60000,
                                                            errors: ["time"]
                                                        }).then(async (collected) => {
                                                            var giveawayMessage = collected.first().content;
                                                            if (isNaN(giveawayMessage)) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.optionsmessageerror))
                                                            await data.database.query(`UPDATE giveaway SET message = "${giveawayMessage}" WHERE id = "1" && serverid = "${message.guild.id}" && authorid = "${message.author.id}"`)
                                                            i.delete()
                                                            collected.first().delete();
                                                            return reaction.remove(message.author.id);
                                                        })
                                                    })
                                                }
                                                if (reaction.emoji.name === "🔊") {
                                                    c.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.optionsvoc)).then(i => {
                                                        message.channel.awaitMessages(filter, {
                                                            max: 1,
                                                            time: 60000,
                                                            errors: ["time"]
                                                        }).then(async (collected) => {
                                                            var giveawayMessage = collected.first().content;
                                                            if (isNaN(parseInt(giveawayMessage))) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.optionsvocerror))
                                                            await data.database.query(`UPDATE giveaway SET voice="${ms(giveawayMessage)}" WHERE id = "1" && serverid = "${message.guild.id}" && authorid = "${message.author.id}" && channelid = "${message.channel.id}"`)
                                                            i.delete()
                                                            collected.first().delete();
                                                            return reaction.remove(message.author.id);
                                                        })
                                                    })
                                                }

                                                if (reaction.emoji.name === "📑") {
                                                    c.channel.send(this.client.giveawayManager.generateGiveawaySystemEmbed(language.optionsrole)).then(i => {
                                                        message.channel.awaitMessages(filter, {
                                                            max: 1,
                                                            time: 60000,
                                                            errors: ["time"]
                                                        }).then(async (collected) => {
                                                            var giveawayRole = collected.first().content
                                                            if (!giveawayRole) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.optionsroleerror))
                                                            var role = message.guild.roles.cache.find(r => r.id === giveawayRole) || message.guild.roles.cache.find(r => r.name === collected.first().content) || message.mentions.roles.first() || message.guild.roles.cache.get(giveawayRole.replace('<', '').replace('@', '').replace('&', '').replace('>', ''));
                                                            if (!role) return i.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.optionsroleerror))
                                                            await data.database.query(`UPDATE giveaway SET roleid = "${role.id}" WHERE id = "1" && serverid = "${message.guild.id}" && authorid = "${message.author.id}"`)
                                                            await data.database.query(`UPDATE giveaway SET rolename = "${role.name}" WHERE id = "1" && serverid = "${message.guild.id}" && authorid = "${message.author.id}"`)
                                                            i.delete()
                                                            collected.first().delete();
                                                            return reaction.remove(message.author.id);
                                                        })
                                                    })
                                                }

                                                if (reaction.emoji.name === "🎁") {
                                                    try {
                                                        message.guild.channels.cache.get(giveawayChannel.id).send("I am generating the giveaway :tada:").then(async (m) => {
                                                            await (await this.client.database()).query(`UPDATE giveaway SET id = "${m.id}" WHERE id = "1" && serverid = "${message.guild.id}" && authorid = "${message.author.id}" && channelid = "${giveawayChannel.id}"`)
                                                            const embed = await this.client.giveawayManager.generateGiveaway(this.client, data, message.guild.me.displayHexColor, m.id)
                                                            await m.edit(":tada: **GIVEAWAY** :tada:", embed);
                                                            await m.react("🎉");
                                                        });
                                                    } catch (error) {
                                                        return message.channel.send(this.client.giveawayManager.generateGiveawayEmbedError(language.giveawayerror));
                                                    };
                                                    return c.delete(c)
                                                }
                                                if (reaction.emoji.name === "❌") {
                                                    await (await this.client.database()).query(`UPDATE giveaway SET finish = "yes" WHERE id = "1" && serverid = "${message.guild.id}" && authorid = "${message.author.id}"`)
                                                    c.delete(c)
                                                }
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }
}

module.exports = gstart;