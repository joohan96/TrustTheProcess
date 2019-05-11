'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {

    var db = mongoose.connect('mongodb://localhost:27017/TrustTheProcess');

    var UserSchema = new Schema({
        fullName: { 
            type: String, required: true, 
            trim: true, unique: true, 
        },
        email: {
            type: String, required: true,
            trim: true, unique: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        },
        facebookProvider: {
            type: {
                id: String,
                token: String
            },
            select: false
        }
    });

    UserSchema.set('toJSON', { getters: true, virtuals: true });

    UserSchema.statics.upsertFbUser = function (accessToken, refreshToken, profile, cb) {
        var that = this;
        return this.findOne({
            'facebookProvider.id': profile.id
        }, function (err, user) {
            if (!user) {
                var newUser = new that({
                    fullName: profile.name.givenName + ' ' + profile.name.middleName + ' ' + profile.name.familyName,
                    email: profile.emails[0].value,
                    facebookProvider: {
                        id: profile.id,
                        token: accessToken
                    }
                });
                newUser.fullName = profile.name.givenName + ' ' + profile.name.middleName + ' ' + profile.name.familyName;

                newUser.save(function (error, savedUser) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(savedUser);
                    }
                    return cb(error, savedUser);
                });
            } else {
                return cb(err, user);
            }
        });
    };

    mongoose.model('User', UserSchema);

    return db;
};
