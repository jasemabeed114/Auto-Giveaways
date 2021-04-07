const express = require('express');
const router = express.Router();
const Discord = require('discord.js');

router.get('/', async (req, res, next) => {
    if(req.query.succes == "true") {
        res.render('../views/success')
    } else if(req.query.succes == "false") {
        res.render('../views/formulas/error')
    } else {
        res.render('../views/shop', {
            client: req.client.user
        })
    }
})

router.post('/', async(req, res, next) => {
    const client = req.client;
    const guild = client.guilds.cache.get('783112936611643393');
    const user = await guild.members.fetch(req.body.user);
    if(!user) return;

    const prenom = req.body.prenom, age = req.body.age, qualites = req.body.qualites, defauts = req.body.defauts, exp = req.body.exp, motiv = req.body.motiv, add = req.body.add;
    const channel = await guild.channels.create(`💼・${user.user.username}`, {
        topic: `Salon de recrutement pour ${user}`,
        parent: "825439434744266823",
        permissions: [
            {
                id: guild.everyone,
                deny: ['VIEW_CHANNEL']
            },
            {
                id: user.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            }
        ]
    })
    channel.send('<@&823990566278791168>',
        new Discord.MessageEmbed()
            .setColor('#5c7aff')
            .setTitle('Recrutement')
            .setDescription(`Hey ${user},
            
            Vous avez décidé de faire votre demande pour être recruté dans notre staff. Nous tenons tout d'abord à vous remercier pour l'intérêt que vous portez à notre serveur. Veuillez patienter le temps qu'un gérant ne vous réponde. Voici, pour les gérants, les informations que vous avez remplies.`)
            .addField('**IDENTIFIANT**', user.id)
            .addField('**PRENOM**', prenom)
            .addField('**ÂGE**', age)
            .addField('**QUALITES**', qualites)
            .addField('**DEFAUTS**', defauts)
            .addField('**EXPERIENCE**', exp)
            .addField('**MOTIVATIONS**', motiv)
            .addField('**AJOUT SUPPLEMENTAIRE**', add == "" ? "Aucun ajout." : add)
    )
    user.send(`<a:flehe:823995431108476979>・**HEY**, nous avons correctement reçu ta candidature. Nous t'ajouterons à un salon très prochainement pour te donner la réponse. D'ici là, sois actif ;)`)
    res.render('../views/shop')
})

module.exports = router;