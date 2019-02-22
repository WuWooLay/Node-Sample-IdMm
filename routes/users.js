const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', (req, res) => {
    console.log(req.body);
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
        res.send('Register Post');
    }

});

module.exports = router;