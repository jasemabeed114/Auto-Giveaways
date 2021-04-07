const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/', (req, res) => {
    res.send('Vous n\'avez pas accès à cette page.')
})

router.post('/', bodyParser.raw({type: 'application/json'}), (request, response) => {
    console.log(request.body)
    const event = request.body;
  
    switch(event.type) {
        case 'payout.paid': console.log(event.data)
        case 'order.created': console.log(event.data)
        case 'payement_intent.created': console.log(event.data)
        default: console.log(event.data)
    }
    response.json({received: true});
  });

module.exports = router;