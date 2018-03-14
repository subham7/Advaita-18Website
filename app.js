const express = require('express');
var app = express();

const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('express-handlebars');
const fs = require('fs');

//Port no.
var port = 8080;

//Configuration
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Custom modules
const connection = require('./routes/dbconfig')(mysql);
const registration = require('./routes/registration')(app, connection);
const admin = require('./routes/admin')(app, connection);

//View Engine Setup
app.engine('hbs', hbs({extname: 'hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Routes
app.get('/', function(req, resp) {
    resp.sendFile(path.join(__dirname, 'public', 'index.min.html'));
});

app.get('/team', function(req, resp) {
    resp.sendFile(path.join(__dirname, 'public', 'team.html'));
});

app.get('/ingenium', function(req, resp) {
    resp.sendFile(path.join(__dirname, 'public', 'ingenium.html'));
});

app.get('/event/:var', function(req, resp) {
    var eventName = req.params.var;

    if(fs.existsSync(path.join(__dirname, 'views', eventName + '.hbs'))) {
        if(eventName == 'xyz' || eventName == 'admin') resp.render('404');
        else {
            resp.render(eventName);
        }
    } else {
        resp.render('404');
    }
});

app.get('/registration/success/:username/:eventname', function(req, resp) {
    resp.render('success', {username: req.params.username, eventName: req.params.eventname})        
});

app.get('/registration/unsuccess', function(req, resp) {
    resp.render('oops');
});

app.get('/admin', function(req, resp) {
    resp.render('xyz');
});

app.get('*', function(req, resp) {
    resp.render('404');
});

app.listen(port, function() {
    console.log(`Server started at ${port}`);
});
