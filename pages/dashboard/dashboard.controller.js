app.controller("DashboardCtrl", ["$scope", "$location","filterFilter", function($scope, $location, filterFilter) {
    $scope.rango 			= [1,2,3,4,5,6,7,8,9];
    $scope.dataUser 		= JSON.parse(localStorage.getItem("PuntoVentaUserData"));
    $scope.currentSucursal 	= filterFilter($scope.dataUser.sucursales, {idSucursal: $scope.dataUser.idSucursal})[0];
    $scope.idSucursal		= $scope.dataUser.idSucursal;

    $scope.ctrl = {myDate1: '', myDate2: ''};
}]);