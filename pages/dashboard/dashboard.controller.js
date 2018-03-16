app.controller("DashboardCtrl", ["$scope", "$location","filterFilter", function($scope, $location, filterFilter) {
    $scope.rango 			= [1,2,3,4,5,6,7,8,9];
    $scope.dataUser 		= JSON.parse(localStorage.getItem("PuntoVentaUserData"));
    $scope.currentSucursal 	= filterFilter($scope.dataUser.sucursales, {idSucursal: $scope.dataUser.idSucursal})[0];
    $scope.idSucursal		= $scope.dataUser.idSucursal;

    // Variables de control de paneles
    $scope.panel = {
    	resumen: true,
    	ventas:{ notas: false, analisis: false },
    	gastos:{ notas: false, analisis: false },
    	entradas: { notas: false, analisis: false },
    	traspasos:{ notas: false, analisis: false },
    	mezclas:  { notas: false, analisis: false }
    }

    $scope.ctrl = {myDate1: '', myDate2: ''};
    $scope.prueba = "Esto es una prueba";

    $scope.Pedrito = function(){
    	alert("Este fue pedrito");
    }

    $scope.controlPanel = function( panel, seccion ){
    	$scope.panel = {
	    	resumen: false,
	    	ventas:{ notas: false, analisis: false },
	    	gastos:{ notas: false, analisis: false },
	    	entradas: { notas: false, analisis: false },
	    	traspasos:{ notas: false, analisis: false },
	    	mezclas:  { notas: false, analisis: false }
	    }

	    $scope.panel[ panel ][ seccion ] = true;
    }

    $scope.controlPanelReturn = function(){
    	$scope.panel = {
	    	resumen: true,
	    	ventas:{ notas: false, analisis: false },
	    	gastos:{ notas: false, analisis: false },
	    	entradas: { notas: false, analisis: false },
	    	traspasos:{ notas: false, analisis: false },
	    	mezclas:  { notas: false, analisis: false }
	    }
    }
}]);