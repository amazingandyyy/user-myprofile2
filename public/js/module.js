'use strict';

var app = angular.module('myApp', ['ui.router','ui.bootstrap']);

// localStorage.ngProductsList = [{'name': 'andy'}, {'yo': 'dd'}];
// console.log('ddd: ', JSON.parse(localStorage.ngProductsList));

app.config(function($stateProvider, $urlRouterProvider) {
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
