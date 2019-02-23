// http://www.passportjs.org/docs/configure/

const LocalStrategy = require('passport-local')
.Strategy;
const bcrypt = require('bcryptjs');

// LoadUser Modal
const User = require('../models/User');

module.exports = function (passport) {

    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        console.log(email);
        console.log(password);
        User.findOne({
            email
        }).then( user => {
            // Not Found User
            if(!user) return done(null, false, {message: 'No User Found'});

            // User Match
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Incorrect Password par Bado'});
                }

            });

        }).catch(
        );
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
};