const config = require('config');
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

// For Routers
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// call LocalPassport
const LocalPassport = require('./config/passport');
LocalPassport(passport);

// Get Rid Of Warning, Mapping Global Promise 
mongoose.Promise = global.Promise;
// Connect MongoDb 
mongoose.connect(config.get('mongoURI'), {useNewUrlParser: true})
    .then(() => console.log('Connect MongoDb...'))
    .catch((err) => console.error(err));

// If Development Use Morgan
if(app.get('env') === 'development') {
        app.use(morgan('tiny'));
        console.log('Use Morgan...');
}

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

// Passport Session And Initialize
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// GlobalVariable like Custom Middlewares
app.use( (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
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

const port = process.env.PORT || config.get('port');

app.listen(port, () => {
    console.log(`Server Started On Port ${port}`);
});