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
            if(!user) return done(null, false, {message: 'No User Found'});
        }).catch(
        );
    }));
};