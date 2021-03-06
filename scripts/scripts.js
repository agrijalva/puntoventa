"use strict";
var app = angular.module("yapp", ["ui.router", "ngAnimate", "ngSanitize","ui.carousel","angucomplete-alt","ngMaterial","ngMessages"]).config(["$stateProvider", "$urlRouterProvider", function(r, t) {
    t.when("/admin", "/admin/overview"), t.otherwise("/login"), 
    r.state("base", {
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
    .state("admin", {
        url: "/admin",
        parent: "base",
        cache:false,
        templateUrl: "pages/admin.html",
        controller: "AdminCtrl"
    })    
    .state("resumen", {
        url: "/resumen",
        parent: "admin",
        cache:false,
        templateUrl: "pages/dashboard/templates/dashboard.html",
        controller: "DashboardCtrl"
    })
    .state("productos", {
        url: "/productos",
        parent: "admin",
        cache:false,
        templateUrl: "pages/productos/productos.html",
        controller: "ProductosCtrl"
    })
    .state("precios", {
        url: "/precios",
        parent: "admin",
        cache:false,
        templateUrl: "pages/precios/precios.html",
        controller: "PreciosCtrl"
    })
    .state("listaprecios", {
        url: "/listaprecios",
        parent: "admin",
        cache:false,
        templateUrl: "pages/listaprecios/listaprecios.html",
        controller: "ListapreciosCtrl"
    })
    .state("inventarios", {
        url: "/inventarios",
        parent: "admin",
        cache:false,
        templateUrl: "pages/inventarios/templates/inventarios.html",
        controller: "InventariosCtrl"
    })
    .state("stock", {
        url: "/stock",
        parent: "admin",
        cache:false,
        templateUrl: "pages/inventarios/templates/stock.html",
        controller: "InventariosCtrl"
    })
    .state("registroinventario", {
        url: "/registroinventario",
        parent: "admin",
        cache:false,
        templateUrl: "pages/inventarios/templates/registroinventario.html",
        controller: "InventariosCtrl"
    })
    .state("caja", {
        url: "/caja",
        parent: "base",
        cache:false,
        templateUrl: "pages/caja/templates/caja.html",
        controller: "CajaCtrl"
    })
}]);

var Authorization = 'eb60959f5eac3e1d081244c33d4fb850';


app.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
       return moment(date).format('YYYY-MM-DD');
    };
});
// ============ [ v1.0.0 ]
// var API_Path = "http://localhost/puntoventaAPI/v1/index.php"

// ============ [ v1.3.0 ]
var API_Path = "http://localhost/puntoventaAPI/v1.3/index.php"

// angular.module("yapp").controller("DashboardCtrl", ["$scope", "$state", function(r, t) {

//     r.$state = t

// }]);