const express = require('express');
const exphbs = require('express-handlebars');

const port = 5000;
const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use((req, res, next) => {
    req.name = "Lwin";
    next();
});

app.get('/', (req, res) => {
    const title = "Home Page";
    res.render('index', {title});
});

app.get('/about', (req, res) => {
    res.send('About Page');
});

app.listen(port, () => {
    console.log(`Server Started On Port ${port}`);
});