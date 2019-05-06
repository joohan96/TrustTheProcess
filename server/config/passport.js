var configAuth = require('./auth');
var User = require('../models/user.model');

var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {
	passport.use(new FacebookStrategy({
	    clientID: configAuth.facebookAuth.clientID,
	    clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['email', 'name']
	  },
	  function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		User.findOne({'facebook.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
                        var newUser = new User();
                        console.log(profile);
	    				newUser.facebook.id = profile.id;
	    				newUser.facebook.token = accessToken;
	    				newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
	    				newUser.facebook.email = profile.emails[0].value;

	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
                        })
                        
	    			}
	    		});
	    	});
	    }
    ));
    
    passport.serializeUser(function(user, done) {
        console.log(user);
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
         done(err, user);
        });
       });
      
};