"use strict";
angular.module("yapp", ["ui.router", "ngAnimate"]).config(["$stateProvider", "$urlRouterProvider", function(r, t) {
    t.when("/dashboard", "/dashboard/overview"), t.otherwise("/login"), r.state("base", {
        "abstract": !0,
        url: "",
        templateUrl: "views/base.html"
    })
    .state("login", {
        url: "/login",
        parent: "base",
        templateUrl: "views/login.html",
        controller: "LoginCtrl"
    })
    .state("dashboard", {
        url: "/dashboard",
        parent: "base",
        templateUrl: "views/dashboard.html",
        controller: "DashboardCtrl"
    })
    .state("overview", {
        url: "/overview",
        parent: "dashboard",
        templateUrl: "views/dashboard/overview.html"
    })
    .state("reports", {
        url: "/reports",
        parent: "dashboard",
        templateUrl: "views/dashboard/reports.html"
    })
    .state("agentes", {
        url: "/agentes",
        parent: "dashboard",
        templateUrl: "views/dashboard/agentes.html"
    })
    .state("catalogo", {
        url: "/catalogo",
        parent: "dashboard",
        templateUrl: "views/dashboard/catalogo.html"
    })
    .state("nuevo_agente", {
        url: "/nuevo_agente",
        parent: "dashboard",
        templateUrl: "views/dashboard/nuevo_agente.html"
    })
}]),angular.module("yapp").controller("LoginCtrl", ["$scope", "$location", function(r, t) {
    r.submit = function() {
        return t.path("/dashboard/agentes"), !1
    }
}]), angular.module("yapp").controller("DashboardCtrl", ["$scope", "$state", function(r, t) {
    r.$state = t
}]);