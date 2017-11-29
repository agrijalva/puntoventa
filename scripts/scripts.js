"use strict";
var app = angular.module("yapp", ["ui.router", "ngAnimate", "ngSanitize","ui.carousel"]).config(["$stateProvider", "$urlRouterProvider", function(r, t) {
    t.when("/admin", "/admin/overview"), t.otherwise("/login"), r.state("base", {
        "abstract": !0,
        url: "",
        templateUrl: "pages/base.html"
    })
    .state("login", {
        url: "/login",
        parent: "base",
        cache:false,
        templateUrl: "pages/login/login.html",
        controller: "LoginCtrl"
    })
}]);

var API_Path = "http://localhost/APIForrajera/v1/index.php"
// var API_Path = "http://pfiscal.loladisenio.com.mx/restapi/v1/index.php";
var Authorization = 'eb60959f5eac3e1d081244c33d4fb850';

angular.module("yapp").controller("DashboardCtrl", ["$scope", "$state", function(r, t) {
    r.$state = t
}]);