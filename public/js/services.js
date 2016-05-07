'use strict';

var app = angular.module('myApp');

app.service('Auth', function($http) {

    this.getProfile = () => {
        return $http({
            method: 'GET',
            url: '/api/users/profile/own'
        });
    }
    this.login = (userObj) =>{
        return $http({
            method: 'POST',
            url: '/api/users/login',
            data: userObj
        });
    }
    this.register = (userObj) =>{
        return $http({
            method: 'POST',
            url: '/api/users/register',
            data: userObj
        });
    }
    this.logout = () =>{
        return $http({
            method: 'DELETE',
            url: '/api/users/logout'
        });
    }
});
app.service('User', function($http) {

    this.getProfileById = (userId) => {
        return $http({
            method: 'GET',
            url: `/api/users/profile/${userId}`
        });
    }
    this.editProfile = (userObj) => {
        return $http({
            method: 'PUT',
            url: '/api/users/profile/own',
            data: userObj
        });
    }
});
