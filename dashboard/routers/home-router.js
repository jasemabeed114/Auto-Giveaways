const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    res.render('../views/index.ejs', {
        client: req.client
    })
})

module.exports = router;