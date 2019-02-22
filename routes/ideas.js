const express = require('express');
const router = express.Router();
// Model List
const Idea = require('../models/idea');

router.get('/', (req, res) => {

    Idea.find({})
        .sort({'date': -1})
        .then( ideas => res.render('ideas/index', {ideas}) )
        .catch( err => console.error('error => ', err));

});

router.get('/add', (req, res) => {
    res.render('ideas/add');
});

router.post('/add', (req, res) => {
    console.log(req.body);
    const error = [];

    if(!req.body.idea) {
        error.push({'text': 'Title Needed'});
    }

    if(!req.body.details) {
        error.push({'text': 'Details Needed'});
    }

    if(error.length > 0) {
        res.render('ideas/add', {
            error,
            title: req.body.idea,
            details: req.body.details
        });
    } else {

        let idea = new Idea({
            title: req.body.idea,
            details: req.body.details,
        });

        idea = idea.save()
                .then( (data) => res.redirect('/ideas'))
                .catch( (err) => console.error(err) );
    }


});

router.get('/edit/:id', (req, res) => {
    const _id = req.params.id;

    Idea.findById({
        _id
    }).then((idea) => {
        res.render('ideas/edit', {
            idea
        });
    })
    .catch(err => console.err(err));
    
})

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
    const _id = req.params.id;

    Idea.remove({_id})
        .then(idea => {
             req.flash('success_msg', 'Successfully Removeded');
             res.redirect('/ideas');
        })
        .catch(err => console.error(err));
});

module.exports = router;