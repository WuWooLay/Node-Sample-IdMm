const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var methodOverride = require('method-override')
 

const port = 5000;
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))

// Get Rid Of Warning, Mapping Global Promise 
mongoose.Promise = global.Promise;
// Connect MongoDb 
mongoose.connect('mongodb://localhost/mm_video', {useNewUrlParser: true})
    .then(() => console.log('Connect MongoDb...'))
    .catch((err) => console.error(err));

// Use HandleBars Engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Model List
const Idea = require('./models/idea');

// Routes
app.get('/', (req, res) => {
    const title = "Text Crud";
    res.render('index', {title});
});

app.get('/about', (req, res) => {
    res.render('about');
});

// Ideas Route
app.get('/ideas', (req, res) => {

    Idea.find({})
        .sort({'date': -1})
        .then( ideas => res.render('ideas/index', {ideas}) )
        .catch( err => console.error('error => ', err));

});

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

app.post('/ideas/add', (req, res) => {
    console.log(req.body);
    const error = [];

    if(!req.body.idea) {
        error.push({'text': 'Title Needed'});
    }

    if(!req.body.details) {
        error.push({'text': 'Details Needed'});
    }

    if(error.length > 0) {
        res.render('add_ideas', {
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

app.get('/ideas/edit/:id', (req, res) => {
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

app.put('/ideas/:id', (req, res) => {
    
});

app.listen(port, () => {
    console.log(`Server Started On Port ${port}`);
});