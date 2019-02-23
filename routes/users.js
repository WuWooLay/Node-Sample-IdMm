const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

const User = require('../models/User');


router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    
});


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', (req, res) => {

    const { name, email, password, confirmpassword } = req.body;
    const errors = [];

    if( password != confirmpassword ) {
        errors.push({text: 'Password Do Not Match'});
    }

    if( password.length <= 4 ) {
        errors.push({text: 'Password must be AtLeast 4 characters'});
    }

    if( errors.length > 0 ) {
        res.render('users/register', {
            name,
            email,
            password,
            confirmpassword,
            errors
        });
    } else {

        User.findOne({email})
            .count()
            .then(data => {
                if(data == 0 ) {
                    let newUser = new User({
                        name,
                        email,
                        password
                    });
            
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
            
                            newUser.save()
                                .then((user) => {
                                    req.flash('success_msg', 'Successfully Register , U Can Login Now!!');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.error('errSave=>', err) );
                        });
                    });
                } else {
                    errors.push({text: 'Email is Already Used'});
                    res.render('users/register', {
                        name,
                        email,
                        password,
                        confirmpassword,
                        errors
                    });
                }
            })
            .catch(err => console.error('err=> ', err));

            
    }


});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Successfully Logout!');
    res.redirect('/users/login');
})

module.exports = router;