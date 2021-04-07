const express = require('express');
const router = express.Router();
const ms = require('ms');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'live',
    'client_id': 'AUidZSC5g9XquT_c34MEPUi5y65PR0uuNjZ2rve2smEZHj3A9dYeL2Cmpu-0Y9wYostcqzrdPBTVTDh_',
    'client_secret': 'EK098sD4Q2GzLDJf8py9oQ0w-yxqaaxT3AjP_I73YelgOfiGPMcyM2o9G6PUiuqcasUOuSR9t6a-DeTs'
});

router.get('/', async (req, res, next) => {
    const client = req.client;

    const g = req.cookies['guild']
    const formula = req.cookies['formule']
    res.clearCookie('guild')
    res.clearCookie('formule')
    const guild = client.guilds.cache.get(g)
    if(!guild) return res.redirect(`/shop`);

    var price = 5;
    if(formula == "1") price = price + 1;
    if(formula == "2") price = price + 2;
    if(formula == "3") price = price + 3;
    if(formula == "4") price = price + 5;

    const paymentId = req.query.paymentId;
    const payerId = req.query.PayerID;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
          "amount": {
            "currency": "EUR",
            "total": price + ".00"
          }
        }]
    }

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
            return res.redirect('/shop?succes=false')
        } else {
            const support = client.guilds.cache.get('783112936611643393');
            const costumer = await support.members.fetch(req.user.id) || "Un inconu";
            const inviteC = guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
            const invite = await inviteC.createInvite({
                maxAge: 0,
                maxUses: 0
            }).catch(console.error);
        
            var giveawayDuration = 0;
            if(formula == "1") giveawayDuration = 604800000;
            if(formula == "2") giveawayDuration = 604800000;
            if(formula == "3") giveawayDuration = 777600000;
            if(formula == "4") giveawayDuration = 1036800000;
        
            var mention = "";
            if(formula == "1") mention = "<@&823990584573689938>";
            if(formula == "2") mention = "<@&823990584573689938> | @here";
            if(formula == "3") mention = "@everyone";
            if(formula == "4") mention = "@everyone";
        
            const [giveaways] = await (await client.database()).query(`SELECT * FROM giveaway WHERE finish='no'`);
            const giveawayChannel = await support.channels.create(`🎁・giveaway-${giveaways.length + 1}`, {
                topic: 'Giveaway payé par <@' + costumer + '>',
                parent: '823997137921638440'
            })
        
            const data = [];
            const language = await client.functions.getLanguage({lang: 'fr'})
            data.language = language;
            const giveawayM = await giveawayChannel.send('Préparation du giveaway...');
            await (await client.database()).query(`INSERT INTO giveaway (id,serverid,authorid,channelid,cadeau,duration,gagnant,datenow,cserverid,cservername,cserverinvite,endTimestamp) VALUES ('${giveawayM.id}','${guild}','${req.user.id}','${giveawayChannel.id}',"Nitro Classic",'${giveawayDuration}','1','${Date.now()}', '${guild.id}', "${guild.name}", '${invite}','${Date.now() + giveawayDuration}')`)
            const embed = await client.giveawayManager.generateGiveaway(client, data, "#5c7aff", giveawayM.id);
            await giveawayM.edit(":tada: **GIVEAWAY** :tada:", embed);
            await giveawayM.react("🎉");
        
            giveawayChannel.send(`**__Hey !__**\n\nNous nous retrouvons aujoud'hui pour un nouveau giveaway organisé par ${costumer} !\n<:nitro:824709039421521950>・Tentez de gagner un **Nitro Classic** !\n<:duration:824708921952436244>・Vous avez **${ms(giveawayDuration)}** pour participer.\n<:error:823995430680920125>・**Attention**, pour participer, vous devez rejoindre le serveur suivant: ${invite} ! Si vous quittez, votre réaction sera supprimée.\n\n**__Bonne chance !__**\n${mention}`)
            res.redirect('/shop?succes=true')
        }
    });
})

module.exports = router;