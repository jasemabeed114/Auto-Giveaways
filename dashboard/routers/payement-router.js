require('dotenv').config()
const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': process.env.PAYPAL_MODE,
    'client_id': process.env.PAYPAL_ID,
    'client_secret': process.env.PAYPAL_SECRET
});

router.post('/', async (req, res, next) => {

    res.cookie('formule', req.body.formula)
    res.cookie('guild', req.body.guild)

    const u = req.user;
    const g = req.client.guilds.cache.get('783112936611643393');
    const members = await g.members.fetch();
    const member = members.find(m => m.id == u.id);
    if(!member) return next();

    var price = 5;
    if(req.body.formula == "1") price = price + 1;
    if(req.body.formula == "2") price = price + 2;
    if(req.body.formula == "3") price = price + 3;
    if(req.body.formula == "4") price = price + 5;

    if(member.roles.cache.has('826523860261142589') || member.roles.cache.has('824001322096787469') && req.body.formula != "1") {
        price = price - (price / 20)
    }

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://discord-eclipse.xyz/success",
            "cancel_url": "http://discord-eclipse.xyz/buy"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": `Formule #${req.body.formula} - Auto'Giveaways`,
                    "sku": "item",
                    "price": price,
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": price
            },
            "description": `Paiement de ${u.username} - Formule #${req.body.formula}`
        }]
    };
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            link = payment.links[1].href; 
        }
    });
    setTimeout(function () {
        return res.json({link: link});
    }, 1500)
})

module.exports = router;
