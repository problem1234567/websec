//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    name: String,
    password: String
});

const secret ='Thisisourlittlesecret.';
userSchema.plugin(encrypt,{secret:secret, encryptedFields:['password']});


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
    const newUser = new User({
        name: req.body.username,
        password: req.body.password
    });

    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render('secrets');
        }
    });

});


app.post('/login',function(req,res){
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({name:userName},function(err,foundUser){
        if (err){
            console.log(err); 
        } else { 
            if (foundUser && password === foundUser.password){
                res.render('secrets');
            } else {
                res.redirect('/login');
            }
        }
    });
});

app.listen(process.env.PORT || 3001, function () {
    console.log("server running....");
})