'use strict';

require('./mongoose')();
var passport = require('passport');
var User = require('mongoose').model('User');
var FacebookTokenStrategy = require('passport-facebook-token');
var config = require('./config');

module.exports = function () {
    passport.use(new FacebookTokenStrategy({
            clientID: config.facebookAuth.clientID,
            clientSecret: config.facebookAuth.clientSecret,
            profileFields: ['email', 'name']
        },
        function (accessToken, refreshToken, profile, done) {
            User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
                return done(err, user);
            });
        }));
};