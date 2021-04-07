const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    res.render('../views/recruitements', {
        client: req.client,
    })
})

module.exports = router;