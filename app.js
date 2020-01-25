//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const saltRounds = 10;
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    name: String,
    password: String
});


// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});


const User = mongoose.model('User', userSchema);

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            console.log(err);
        } else {
            const newUser = new User({
                name: req.body.username,
                password: hash
            });

            newUser.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('secrets');
                }
            });
        }
    });


});


app.post('/login', function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({
        name: userName
    }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result == true) {
                        res.render('secrets');
                    } else {
                        res.redirect('/login');
                    }
                });
            } else {
                res.redirect('/login');
            }
        }
    });
});

app.listen(process.env.PORT || 3001, function () {
    console.log("server running....");
})