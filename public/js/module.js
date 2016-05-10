'use strict';

var app = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'satellizer']);

// localStorage.ngProductsList = [{'name': 'andy'}, {'yo': 'dd'}];
// console.log('ddd: ', JSON.parse(localStorage.ngProductsList));

app.config(function($stateProvider, $urlRouterProvider, $authProvider) {
    $authProvider
        .github({
            clientId: 'dc615a3b2c2f187404db'
        });
    $authProvider
        .facebook({
            clientId: '1057286630983532'
        });
    $authProvider
        .instagram({
            clientId: '2d10f038b89e4d81a5806d85c8ef04fe'
        });


    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '../views/home.html',
            controller: 'homeCtrl'
        })
        .state('community', {
            url: '/community',
            templateUrl: '../views/community.html',
            controller: 'communityCtrl'
        })
        .state('profileSetting', {
            url: '/profileSetting',
            templateUrl: '../views/profileSetting.html',
            controller: 'profileSettingCtrl'
        })
        .state('profile', {
            url: '/profile/:userId',
            templateUrl: '../views/profile.html',
            controller: 'profileCtrl'
        })

    $urlRouterProvider.otherwise('home');

});
