const Command = require("../../base/Command.js"), Discord = require("discord.js");

class ping extends Command {

    constructor(client) {
        super(client, {
            name: "ping",
            aliases: ['lag', 'latence']
        });
    }

    async run(message, args, data, language) {
        const msg = await message.channel.send('<:yes:823995430924451881> **|** Calcule de la latence en cours...');
        await msg.edit(`<:yes:823995430924451881> **|** Calcule de la latence terminé. Ce message a prit \`${msToTime(msg.createdTimestamp - message.createdTimestamp)}\` a s'envoyer. Je suis en ligne depuis **${msToTime(this.client.uptime)}**.`)
    }
}

function msToTime(ms){
    if(ms <= 999) { return `${ms} milisecondes`}
    days = Math.floor(ms / 86400000); // 24*60*60*1000
    daysms = ms % 86400000; // 24*60*60*1000
    hours = Math.floor(daysms / 3600000); // 60*60*1000
    hoursms = ms % 3600000; // 60*60*1000
    minutes = Math.floor(hoursms / 60000); // 60*1000
    minutesms = ms % 60000; // 60*1000
    sec = Math.floor(minutesms / 1000);
  
    let str = "";
    if (days) str = str + days + ` jour${days > 1 ? 's' : ''} `;
    if (hours) str = str + hours + ` heure${hours > 1 ? 's' : ''} `;
    if (minutes) str = str + minutes + ` minute${minutes > 1 ? 's' : ''} `;
    if (sec) str = str + sec + ` seconde${sec > 1 ? 's' : ''} `;
  
    return str;
}

module.exports = ping;