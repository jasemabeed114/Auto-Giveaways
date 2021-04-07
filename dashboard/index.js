require('dotenv').config()
require('./routers/strategies/discord')
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');

exports.run = async (client) => {
    const MySQLStore = require('express-mysql-session')(session);

    const options = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    };

    app
        .set('views', __dirname + '/views')
        .engine("html", require("ejs").renderFile)
        .set("view engine", "ejs")
        .use(express.static(path.join(__dirname, '/public')))
        .use(
            function(req, res, next) {
                req.client = client;
                next();
            }
        )
        .use(bodyParser.urlencoded({ extended: false }))
        .use(bodyParser.json())
        .use(cookieParser())
        .use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false,
            store: new MySQLStore(options)
        }))
        .use(passport.initialize())
        .use(passport.session())

    const homePage = require('./routers/home-router');
    app.use('/', homePage);

    const shopPage = require('./routers/shop-router');
    app.use('/shop', shopPage);

    const first = require('./routers/formula-1-router');
    app.use('/buy', first);

    const payement = require('./routers/payement-router');
    app.use('/payement', payement);

    const success = require('./routers/success-router');
    app.use('/success', success);

    const rc = require('./routers/rc-router');
    app.use('/rc', rc);

    const webhook = require('./routers/weebhook-router');
    app.use('/webhook', webhook);

    const dev = require('./routers/dev-router');
    app.use('/dev', dev)

    // DISCORD API
    const api = require('./routers/DiscordAPI');
    app.use('/api', api);

    const error404 = require('./routers/error404-router');
    app.use('*', error404)

    app.listen(80, function() {
        console.log('%c[SITE] %cServeur express %cprêt %c!', 'color: red', 'color: #fff', 'color: green', 'color: #fff')
    })
}
