var express = require('express');
var router = express.Router();

var qs = require('querystring');
var request = require('request');
var User = require('../models/user');


router.post('/login', (req, res) => {
  User.authenticate(req.body, (err, token) => {
    if(err) return res.status(400).send(err);
    res.send({ token: token });
  });
});

router.post('/signup', (req, res) => {
    console.log('req.body routes/auth-18: ', req.body);
  User.register(req.body, (err, user) => {
    // if(err) return console.log(err);
    console.log("EOROROR", err);
    if(err) return res.status(400).send(err);
    var token = user.makeToken();
    res.send({ token: token });
  });
});


router.post('/github', (req, res) => {
    console.log('req.body: ', req.body);

    var accessTokenUrl = 'https://github.com/login/oauth/access_token';
    var userApiUrl = 'https://api.github.com/user';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: process.env.GITHUB_SECRET
    };

    // use code to request access token
    request.get({
        url: accessTokenUrl,
        qs: params
    }, (err, response, accessToken) => {
        if (err) return res.status(400).send(err);

        var accessToken = qs.parse(accessToken);
        console.log('accessToken: ', accessToken);
        var headers = {
            'User-Agent': 'Satellizer'
        };

        // use access token to request user's information
        request.get({
            url: userApiUrl,
            qs: accessToken,
            headers: headers,
            json: true
        }, (err, response, profile) => {
            if (err) return res.status(400).send(err);
            console.log('profile: ', profile);
            User.findOne({
                github: profile.id
            }, (err, existingUser) => {
                if (err) return res.status(400).send(err);
                if (existingUser) {
                    var token = existingUser.makeToken();
                    console.log('token: ', token);
                    res.send({
                        token: token
                    });
                } else {
                    var user = new User();
                    user.github = profile.id;
                    user.picture = profile.avatar_url;
                    user.save((err, savedUser) => {
                        var token = savedUser.makeToken();
                        console.log('token: ', token);
                        res.send({
                            token: token
                        });
                    });
                }
            });
        })
    })
});
router.post('/facebook', (req, res) => {
    console.log('req.body: ', req.body);

    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: process.env.FACEBOOK_SECRET,
        redirect_uri: req.body.redirectUri
    };

    // use code to request access token
    request.get({
        url: accessTokenUrl,
        qs: params,
        json: true
    }, (err, response, accessToken) => {
        if (err) return res.status(400).send(err);

        var accessToken = qs.parse(accessToken);
        console.log('accessToken: ', accessToken);
        var headers = {
            'User-Agent': 'Satellizer'
        };

        // use access token to request user's information
        request.get({
            url: graphApiUrl,
            qs: accessToken,
            headers: headers,
            json: true
        }, (err, response, profile) => {
            if (err) return res.status(409).send(err);
            console.log('profile: ', profile);
            User.findOne({
                facebook: profile.id
            }, (err, existingUser) => {
                if (err) return res.status(400).send(err);
                if (existingUser) {
                    var token = existingUser.makeToken();
                    console.log('token: ', token);
                    res.send({
                        token: token
                    });
                } else {
                    var user = new User();
                    user.facebook = profile.id;
                    user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                    user.displayName = profile.name;
                    user.save((err, savedUser) => {
                        var token = savedUser.makeToken();
                        console.log('token: ', token);
                        res.send({
                            token: token
                        });
                    });
                }
            });
        })
    })
});
router.post('/instagram', (req, res) => {
    console.log('req.body: ', req.body);

    var accessTokenUrl = 'https://api.instagram.com/oauth/access_token';
    var params = {
        client_id: req.body.clientId,
        redirect_uri: req.body.redirectUri,
        client_secret: process.env.INSTAGRAM_SECRET,
        code: req.body.code,
        grant_type: 'authorization_code'
    };
    console.log('params: ', params);
    // use code to request access token
    request.post({
        url: accessTokenUrl,
        form: params,
        json: true
    }, (err, response, body) => {
        console.log('bodyUUUser', body);
        User.findOne({
            instagram: body.user.id
        }, function(err, existingUser) {
            if (existingUser) {
                return res.send({
                    token: existingUser.makeToken()
                });
            }
            var user = new User({
                instagram: body.user.id,
                picture: body.user.profile_picture,
                displayName: body.user.username
            });

            user.save(function() {
                var token = user.makeToken();
                res.send({
                    token: token,
                    user: user
                });
            });
        });
    });
});

module.exports = router;
