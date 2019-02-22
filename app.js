const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const port = 5000;
const app = express();

// Get Rid Of Warning, Mapping Global Promise 
mongoose.Promise = global.Promise;
// Connect MongoDb 
mongoose.connect('mongodb://localhost/mm_video', {useNewUrlParser: true})
    .then(() => console.log('Connect MongoDb...'))
    .catch((err) => console.error(err));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// override with the "_method" header in the request
app.use(methodOverride('_method'));

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// GlobalVariable like Custom Middlewares
app.use( (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
});

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
    const _id = req.params.id;

    Idea.findById({_id})
        .then(idea => {
            // Get Idea Then We'll be gonna to save
            idea.title = req.body.idea;
            idea.details = req.body.details;
            idea.save()
                .then( idea => res.redirect('/ideas') )
                .catch( err => console.error('errSave => ', err))
        })
        .catch(err => console.error(err));
});

app.delete('/ideas/:id', (req, res) => {
    const _id = req.params.id;

    Idea.remove({_id})
        .then(idea => {
             req.flash('success_msg', 'Successfully Removeded');
             res.redirect('/ideas');
        })
        .catch(err => console.error(err));
});

app.listen(port, () => {
    console.log(`Server Started On Port ${port}`);
});