const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', (req, res) => {

    const { name, email, password, confirmpassword } = req.body;
    const error = [];

    if( password != confirmpassword ) {
        error.push({text: 'Password Do Not Match'});
    }

    if( password.length <= 4 ) {
        error.push({text: 'Password must be AtLeast 4 characters'});
    }

    if( error.length > 0 ) {
        res.render('users/register', {
            name,
            email,
            password,
            confirmpassword,
            error
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
                    error.push({text: 'Email is Already Used'});
                    res.render('users/register', {
                        name,
                        email,
                        password,
                        confirmpassword,
                        error
                    });
                }
            })
            .catch(err => console.error('err=> ', err));

            
    }


});


module.exports = router;