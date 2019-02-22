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
    const title = "Text Crud";
    res.render('index', {title});
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log(`Server Started On Port ${port}`);
});