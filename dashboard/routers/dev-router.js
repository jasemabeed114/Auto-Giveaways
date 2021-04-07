const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    //if(!req.user) return res.redirect('/api/auth/discord')
    res.render('../views/dev', {
        client: req.client,
        user: req.user
    })
})

module.exports = router;