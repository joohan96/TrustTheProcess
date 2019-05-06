var User = require('../models/user.model');

module.exports = function(app, passport){
    app.get('/', function(req, res){
        res.send('WELCOME TO TRUSTTHEPROCESS');
	});

	app.get('/user', function(req, res){
        res.send(req.user);
	});

	app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

	app.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', { successRedirect: '/user',
	                                      failureRedirect: '/' }));
};