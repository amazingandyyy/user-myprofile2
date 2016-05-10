'use strict';

var app = angular.module('myApp');


app.controller('mainCtrl', function($http, $scope, Auth, $state, $auth) {

    $scope.authenticate = (provider) => {
        console.log('log in with ', provider);
        $auth.authenticate(provider);
    };

    console.log('mainCtrl loaded');
    Auth.getProfile().then(function(res) {
        console.log(res);
        $scope.currentUser = res.data;
        // rootCtrl's scope is basically $rootScope
        console.log('user is logged in.');
    }, function(err) {
        console.log('user is not logged in.');
    })

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

    $scope.login = (loginInfo) => {
        $auth.login(loginInfo)
            .then((res) => {
                console.log("RES ONE");
                $scope.currentUser = res.data;
                $scope.loginInfo = null;
            })
            .then((res) => {
                console.log("RES TWO");
                $state.go('home');
            })
            .catch((res) => {
                alert(res.data.error);
            })
    }
    $scope.logout = () => {
        $auth.logout();
    }
    $scope.isAuthenticated = () => {
        return $auth.isAuthenticated();
    }

});
app.controller('homeCtrl', function($http, $scope, Auth, $auth) {
    console.log('homeCtrl loaded');

    Auth.getProfile().then(function(res) {
        console.log(res);
        $scope.currentUser = res.data;
    }, function(err) {
        console.log('user is not logged in.');
    });

    $scope.signup = () => {
        if ($scope.newUser.password !== $scope.newUser.password2) {
            $scope.newUser.password = '';
            $scope.newUser.password2 = '';
            alert('Passwords must match.')
        } else {
            $auth.signup($scope.newUser)
                .then((res) => {
                    console.log($scope.newUser);
                    console.log("RES 1");
                    return $auth.login($scope.newUser);
                })
                .then((res) => {
                    console.log("RES 2");
                    $state.go('home');
                })
                .catch((res) => {
                    console.log("RES 3");
                    console.log(res.data);
                    alert(res.data.error);
                })
        }
    }


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

    $scope.settingProfileSubmitted = () => {
        console.log($scope.settingProfile);
        User.editProfile($scope.settingProfile).then(function(res) {
            $scope.currentUser = $scope.settingProfile;
        }, function(err) {
            console.log('user is not logged in.');
        })
    }
});
