'use strict';

var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    displayName: {
        type: String
    },
    phone: {
        type: String
    },
    facebook: {
        type: String
    },
    github: {
        type: String
    },
    instagram: {
        type: String
    },
    picture: {
        type: String
    }
});

// IT'S MIDDLEWARE!!
userSchema.statics.isLoggedIn = function(req, res, next) {
    // var token = req.cookies.accessToken;
    if (!req.header('Authorization')) {
        return res.status(401).send({
            message: 'Please make sure your request has an Authorization header'
        });
    }
    var token = req.header('Authorization').split(' ')[1];


    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(401).send({
            error: 'Must be authenticated.'
        });

        User
            .findById(payload._id)
            .exec((err, user) => {
                if (err || !user) {
                    // var token = localStorage.satellizer_token;
                    return res.status(400).send(err || {
                        error: 'User not found.'
                    });
                }

                req.user = user;
                next();
            })
    });
};

userSchema.statics.register = function(userObj, cb) {
    // this.create(userObj, (err, user) => {
    //     if (err) return cb(err);
    //     cb(null, user);
    // });
    console.log('userObj:', userObj);
    User.findOne({
        email: userObj.email
    }, (err, dbUser) => {
        console.log(err, dbUser);
        if (err || dbUser) return cb(err || {
            error: 'Email not available.'
        })

        bcrypt.hash(userObj.password, 12, (err, hash) => {
            if (err) return cb(err);

            var user = new User({
                email: userObj.email,
                password: hash
            });

            user.save(cb);
        });
    });
};

userSchema.statics.authenticate = function(userObj, cb) {
    console.log(userObj);
    this.findOne({
        email: userObj.email
    }, (err, dbUser) => {
        if (err || !dbUser) return cb(err || {
            error: 'Login failed. Email or password incorrect.'
        });
        console.log("LOG", dbUser);

        bcrypt.compare(userObj.password, dbUser.password, (err, isGood) => {
            if (err || !isGood) return cb(err || {
                error: 'Login failed. Email or password incorrect.'
            });
            console.log(isGood);
            var token = dbUser.makeToken();

            cb(null, token);
        });
    }).select({
        password: true
    });
};

userSchema.methods.makeToken = function() {
    var token = jwt.sign({
        _id: this._id,
        exp: moment().add(1, 'day').unix() // in seconds
    }, JWT_SECRET);
    return token;
};

var User = mongoose.model('User', userSchema);

module.exports = User;
