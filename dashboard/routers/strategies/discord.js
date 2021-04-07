const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const createConnextion = require('../../../base/mysql');
const db = createConnextion.promise();

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

var scopes = ['identify', 'email'];
var prompt = 'consent'

passport.use(
    new DiscordStrategy({
        clientID: '824375271896645642',
        clientSecret: 'dUF22IKEM52WhG7Zrb1ASIvwoOintb4U',
        callbackURL: 'https://www.discord-eclipse.xyz/api/auth/discord/redirect',
        scope: scopes,
        prompt: prompt
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    })
);