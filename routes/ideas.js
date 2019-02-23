const express = require('express');
const router = express.Router();
const {isLogin} = require('../middleware/helper');
// Model List
const Idea = require('../models/Idea');

router.get('/', isLogin, (req, res) => {

    Idea.find({user: req.user.id})
        .sort({'date': -1})
        .then( ideas => res.render('ideas/index', {ideas}) )
        .catch( err => console.error('error => ', err));

});

router.get('/add', isLogin, (req, res) => {
    res.render('ideas/add');
});

router.post('/add', isLogin, (req, res) => {
    console.log(req.body);
    const errors = [];

    if(!req.body.idea) {
        errors.push({'text': 'Title Needed'});
    }

    if(!req.body.details) {
        errors.push({'text': 'Details Needed'});
    }

    if(errors.length > 0) {
        res.render('ideas/add', {
            errors,
            title: req.body.idea,
            details: req.body.details
        });
    } else {

        let idea = new Idea({
            title: req.body.idea,
            details: req.body.details,
            user: req.user.id
        });

        idea = idea.save()
                .then( (data) => res.redirect('/ideas'))
                .catch( (err) => console.error(err) );
    }


});

router.get('/edit/:id', isLogin, (req, res) => {
    const _id = req.params.id;

    Idea.findById({
        _id
    }).then((idea) => {
        if( idea.user != req.user.id ) {
            req.flash('error_msg', 'Not Authorize');
            res.redirect('/ideas');
        } else {
            res.render('ideas/edit', {
                idea
            });
        }
    })
    .catch(err => console.err(err));
    
})

router.put('/:id', isLogin, (req, res) => {
    const _id = req.params.id;

    Idea.findById({_id})
        .then(idea => {
            // Get Idea Then We'll be gonna to save
            idea.title = req.body.idea;
            idea.details = req.body.details;
            idea.save()
                .then( idea => {
                    req.flash('success_msg', 'Successfully Updated');
                    res.redirect('/ideas');
                })
                .catch( err => console.error('errSave => ', err))
        })
        .catch(err => console.error(err));
});

router.delete('/:id', isLogin, (req, res) => {
    const _id = req.params.id;

    Idea.remove({_id})
        .then(idea => {
             req.flash('success_msg', 'Successfully Removeded');
             res.redirect('/ideas');
        })
        .catch(err => console.error(err));
});

module.exports = router;