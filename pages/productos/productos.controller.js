app.controller("ProductosCtrl", ["$scope", "$location","filterFilter","productosFactory", function($scope, $location, filterFilter,productosFactory) {
    $scope.DataUser = JSON.parse( localStorage.getItem("PuntoVentaUserData") );

    $scope.search 			= '';
    
    $scope.pro_sku 			= '';
    $scope.pro_nombre 		= '';
    $scope.pro_descripcion 	= '';
    $scope.pro_unidad 		= '0';
    $scope.idProducto 		= 0

    $scope.init = function(){
    	$scope.cargaProductos();
    }

    $scope.cargaProductos = function(){
    	productosFactory.muestra( $scope.DataUser.idEmpresa ).then(function(result){
            $scope.Productos = result.data;
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.openModalNuevo = function( index ){
        // Limpiamos los campos para un nuevo producto
        $scope.pro_sku          = '';
        $scope.pro_nombre       = '';
        $scope.pro_descripcion  = '';
        $scope.pro_unidad       = '0';
        $("#myModal").modal('show');
    }

    $scope.guardarNuevo = function(){
        var parametros = {
            pro_sku:         $scope.pro_sku,
            pro_nombre:      $scope.pro_nombre,
            pro_descripcion: $scope.pro_descripcion,
            pro_unidad:      $scope.pro_unidad,
            idEmpresa:       $scope.DataUser.idEmpresa
        }

        productosFactory.nuevo( parametros ).then(function(result){
            var nuevo = result.data;
            if( nuevo.success ){
                $scope.cargaProductos();
                $("#myModal").modal('hide');
            }
            swal("Punto de Venta", nuevo.msg);
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.openModalEditar = function( index ){
        $scope.idProducto       = $scope.Productos.data[ index ].idProducto;

        $scope.pro_sku          = $scope.Productos.data[ index ].pro_sku;
        $scope.pro_nombre       = $scope.Productos.data[ index ].pro_nombre;
        $scope.pro_descripcion  = $scope.Productos.data[ index ].pro_descripcion;
        $scope.pro_unidad       = $scope.Productos.data[ index ].pro_unidad;
        $scope.idProducto       = $scope.Productos.data[ index ].idProducto;
        $("#myModalEditar").modal('show');
    }

    $scope.guardarEdicion = function(){
        var parametros = {
            pro_sku:         $scope.pro_sku,
            pro_nombre:      $scope.pro_nombre,
            pro_descripcion: $scope.pro_descripcion,
            pro_unidad:      $scope.pro_unidad,
            idProducto:      $scope.idProducto
        }

        productosFactory.editar( parametros ).then(function(result){
            var nuevo = result.data;
            if( nuevo.success ){
                $scope.cargaProductos();                
                $("#myModalEditar").modal('hide');
            }
            swal("Punto de Venta", nuevo.msg);
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.eliminar = function( index ){
        swal({
            title: '¿Estas seguro?',
            text: "Al eliminar este producto se perderan todas las relaciones con los Stoks e Inventarios en las sucursales.",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Si, Eliminar!',
            closeOnConfirm: false
        },
        function(){
            productosFactory.eliminar( $scope.Productos.data[ index ].idProducto ).then(function(result){
                var nuevo = result.data;
                if( nuevo.success ){
                    $scope.cargaProductos();
                }
                swal("Punto de Venta", nuevo.msg);
            }, function(error){
                console.log("Error", error);
            }); 
        });
    }
}]);