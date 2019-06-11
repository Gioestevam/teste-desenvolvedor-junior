const express = require('express');
const app     = express();
const expressLayout = require('express-ejs-layouts');
const bodyParser    = require('body-parser');
const port = 3000;

/**
 * Configuração do servidor
 */
app.set('view engine', 'ejs');
app.use(expressLayout);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`${__dirname}/public`));
app.set('views', `${__dirname}/src/views`, 'views');
process.env.pathRoot = __dirname;

/**
 * Routes
 */
const views = require('./src/routers/views.router');

app.use('', views);

app.get('*', function(req, res) {
    res.redirect('/home');
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});