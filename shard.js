const config = require('./config')
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./space.js', { token: config.token, totalShards: config.shard });

manager.spawn();
manager.on('shardCreate', shard => {
    console.log(`\x1b[33m[SHARD]\x1b[0m\x1b[0m Shard\x1b[35m ${shard.id}\x1b[0m is ready !`)
});