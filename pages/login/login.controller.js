app.controller("LoginCtrl", ["$scope", "$location","loginFactory", function($scope, $location, loginFactory) {
    $scope.user = '';
    $scope.pass = '';

    $scope.submit = function() {
    	if( $scope.user == '' && $scope.pass == '' ){
    		alert('Asegurate de proporcionar tus credenciales.');
    	}
    	else if( $scope.user == '' ){
    		alert('Proporciona tu usuario para poder acceder al sistema');
    	}
    	else if( $scope.pass == '' ){
    		alert('Proporciona tu contrasema para poder acceder al sistema');
    	}
    	else{
	    	loginFactory.login( $scope.user, $scope.pass ) .then(function(result){
	    		var Resultado = result.data;
                console.log( Resultado );
	    		if( Resultado.success ){
                    localStorage.setItem("PuntoVentaUserData", JSON.stringify(Resultado.data[0]));
                    console.log(Resultado.data[0].idCatalogoUsuario);

                    if( parseInt(Resultado.data[0].idCatalogoUsuario) == 3 ){
                        $location.path("/caja");
                        // $location.path("/admin/productos");
                    }
                    else{
                        $location.path("/admin/productos");
                    }
                    // $location.path("/admin/resumen");
	    		}
	    		else{
	    			swal( "Punto de Venta", Resultado.msg );
	    		}
	        }, function(error){
	            console.log("Error", error);
	        });    		
    	}
    }
}]);