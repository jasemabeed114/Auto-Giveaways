const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    res.clearCookie('guild')
    res.clearCookie('formule')
    if(!req.user) return res.redirect('/api/auth/discord')
    res.render('../views/formulas/buy', {
            client: req.client,
            user: req.user
    })
})

module.exports = router;