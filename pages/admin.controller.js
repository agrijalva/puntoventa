app.controller("AdminCtrl", ["$scope", "$location","filterFilter", function($scope, $location, filterFilter) {
    $scope.DataUser     = JSON.parse( localStorage.getItem("PuntoVentaUserData") );
    $scope.currentUser  = $scope.DataUser.usu_nombre;
    $scope.idCatalogoUsuario = $scope.DataUser.idCatalogoUsuario;
    // $scope.currentUser  = "Aeljandro Grijalva Antonio";    
}]);