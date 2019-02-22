const config = require('config');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const port = 5000;
const app = express();

// For Routers
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Get Rid Of Warning, Mapping Global Promise 
mongoose.Promise = global.Promise;
// Connect MongoDb 
mongoose.connect('mongodb://localhost/mm_video', {useNewUrlParser: true})
    .then(() => console.log('Connect MongoDb...'))
    .catch((err) => console.error(err));

// Middleware For Various HTTP
app.use(helmet());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// override with the "_method" header in the request
app.use(methodOverride('_method'));

// Static Public Place
app.use(express.static(path.join(__dirname, 'public')));

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
    next();
});

// Use HandleBars Engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Routes
app.get('/', (req, res) => {
    const title = "Ideas Crud";
    res.render('index', {title});
});

app.get('/about', (req, res) => {
    res.render('about');
});

//Routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
    console.log(`Server Started On Port ${port}`);
});