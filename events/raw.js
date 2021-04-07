module.exports = class {

    constructor(client) {
        this.client = client;
    }

    async run(raw) {
        if (!['MESSAGE_REACTION_ADD'].includes(raw.t)) return;
        if (raw.d.emoji.name != "🎉") return;
        
        const client = this.client;
        const channel = client.channels.cache.get(raw.d.channel_id);
        const message = await channel.messages.fetch(raw.d.message_id)
        const member = await client.users.fetch(raw.d.user_id);
        if (!message) return
        const reaction = await message.reactions.resolve("🎉");
        client.emit('messageReactionAdd', reaction, member);
    }
}



