'use strict';

var app = angular.module('myApp');


app.controller('mainCtrl', function($http,$scope, Auth, $state) {
    console.log('mainCtrl loaded');
        Auth.getProfile().then(function(res) {
            console.log(res);
            $scope.currentUser = res.data;
            // rootCtrl's scope is basically $rootScope
            console.log('user is logged in.');
        }, function(err) {
            console.log('user is not logged in.');
        })

        $scope.logIn = (loginInfo) => {
            Auth.login(loginInfo)
                .then(function(res) {
                    $scope.currentUser = res.data;
                    $scope.loginInfo = null;
                }, function(err) {
                    console.log('err: ', err);
                })
        }
        $scope.logOut = () => {
            console.log('Out');
            Auth.logout()
                .then(function(res) {
                    $scope.currentUser = null;
                    $scope.loginInfo = null;
                    $state.go('/');
                }, function(err) {
                    console.log('err: ', err);
                })
        }
        $scope.signUp = (newUser) => {
            console.log('create');
            console.log(newUser);
            Auth.register(newUser)
                .then(function(res) {
                    console.log(res);
                    $scope.newUser = null;
                    $scope.logIn(newUser);
                    $scope.logMsg.err = null;
                    $state.go('home');
                }, function(err) {
                    console.log('err: ', err);
                    $scope.logMsg = {err: 'Username is been taken!'}
                })
        }
});
app.controller('homeCtrl', function($http, $scope, Auth) {
    console.log('homeCtrl loaded');
    // $scope.logMsg.err = '';

    Auth.getProfile().then(function(res) {
        console.log(res);
        $scope.currentUser = res.data;
    }, function(err) {
        console.log('user is not logged in.');
    });
});
app.controller('communityCtrl', function($http, $scope, Auth) {
    console.log('communityCtrl loaded');
    $http.get('/api/users').then(function(res) {
        $scope.users = res.data;
    }, function(err) {
        console.log('users are not found.');
    });
});
app.controller('profileCtrl', function($http, User, $scope, $stateParams) {
    console.log('profileCtrl loaded');
    console.log($stateParams.userId);
    User.getProfileById($stateParams.userId).then(function(res) {
        console.log(res.data);
        $scope.user = res.data;
    }, function(err) {
        console.log('user are not found.');
    });
});
app.controller('profileSettingCtrl', function($http, $scope, Auth, User) {
    console.log('profileCtrl loaded');
    console.log($scope.currentUser);
    Auth.getProfile().then(function(res) {
        console.log(res);
        $scope.currentUser = res.data;
        $scope.settingProfile = angular.copy($scope.currentUser);
    }, function(err) {
        console.log('user is not logged in.');
    })

    $scope.settingProfileSubmitted = () =>{
        console.log($scope.settingProfile);
        User.editProfile($scope.settingProfile ).then(function(res) {
            $scope.currentUser = $scope.settingProfile;
        }, function(err) {
            console.log('user is not logged in.');
        })
    }
});
