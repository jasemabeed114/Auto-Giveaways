const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    res.render('../views/404')
})

module.exports = router;