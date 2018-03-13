app.controller("PreciosCtrl", ["$scope", "$location","filterFilter", "preciosFactory", function($scope, $location, filterFilter, preciosFactory) {
    $scope.DataUser         = JSON.parse( localStorage.getItem("PuntoVentaUserData") );
    $scope.search           = '';

    $scope.lpr_nombre       = '';
    $scope.lpr_descripcion  = '';
    $scope.precioCompra     = 0.0;
    $scope.precioVenta      = 0.0;

    $scope.idEmpresa        = 0;
    $scope.idSucursal       = 0;
    $scope.idProducto       = 0;
    $scope.idListaPrecio    = 0;

    $scope.init = function(){
        $scope.listaPrecios();
    }

    $scope.listaPrecios = function(){
        preciosFactory.listasprecio( $scope.DataUser.idEmpresa ).then(function(result){
            $scope.Precios = result.data;

            $scope.Precios.data.forEach( function( item, key ){
                if( item.totalPrecios == 0 ){
                    $scope.Precios.data[ key ].successLista = 0;
                }
                else if( item.totalPrecios == item.totalProductos ){
                    $scope.Precios.data[ key ].successLista = 1;
                }
                else{
                    $scope.Precios.data[ key ].successLista = 2;
                }
            });
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.openModalLista = function(){
        $scope.lpr_nombre       = '';
        $scope.lpr_descripcion  = '';
        $scope.idSucursal       = 0;

        $("#myModal").modal('show');
    }

    $scope.nuevaLista = function(){
        var parametros = {
            lpr_nombre:         $scope.lpr_nombre,
            lpr_descripcion:    $scope.lpr_descripcion,
            idEmpresa:          $scope.DataUser.idEmpresa,
            idSucursal:         $scope.idSucursal
        }

        preciosFactory.listaprecionueva( parametros ).then(function(result){
            var nuevo = result.data;
            if( nuevo.success ){
                $scope.listaPrecios();
                
                localStorage.setItem("LastIdListaPrecios", nuevo.LastId);
                $("#myModal").modal('hide');
                
                $location.path("/admin/listaprecios");
            }
            swal("Punto de Venta", nuevo.msg);
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.detallePrecios = function( idListaPrecio ){
        localStorage.setItem("LastIdListaPrecios", idListaPrecio);
        $location.path("/admin/listaprecios");
    }

    $scope.openModalListaEditar = function( id ){
        var lista = filterFilter($scope.Precios.data, {idListaPrecio: id});
        lista = lista[0];
        console.log( "lista", lista );

        $scope.idListaPrecio    = lista.idListaPrecio;
        $scope.lpr_nombre       = lista.lpr_nombre;
        $scope.lpr_descripcion  = lista.lpr_descripcion;
        $scope.idSucursal       = lista.idSucursal;
        $("#myModalEditar").modal('show');
    }

    $scope.actualizarLista = function(){
        var parametros = {
            idListaPrecio:    $scope.idListaPrecio,
            lpr_nombre:       $scope.lpr_nombre,
            lpr_descripcion:  $scope.lpr_descripcion
        }

        preciosFactory.listaprecioeditar( parametros ).then(function(result){
            var nuevo = result.data;
            if( nuevo.success ){
                $scope.listaPrecios();
                
                $("#myModalEditar").modal('hide');
            }
            swal("Punto de Venta", nuevo.msg);
        }, function(error){
            console.log("Error", error);
        });
    }
    
    $scope.activarListaPrecio = function(idListaPrecio, sucursal){
        swal({
            title: "Punto de Ventata",
            text: "¿Desea convertir esta lista de precios en la principal para la sucursal "+ sucursal +"?",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {            
            preciosFactory.listaprecioactivar( idListaPrecio ).then(function(result){
                var activar = result.data;
                if( activar.success ){
                    $scope.listaPrecios();
                }
                swal("Punto de Venta", activar.msg);
            }, function(error){
                swal("Punto de Venta", error);
                console.log("Error", error);
            });
        });
    }

    $scope.eliminarLista = function(idListaPrecio){
        swal({
            title: "Punto de Ventata",
            text: "¿Desea eliminar esta lista de precios?",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {            
            preciosFactory.listaprecioeliminar( idListaPrecio ).then(function(result){
                var activar = result.data;
                if( activar.success ){
                    $scope.listaPrecios();
                }
                swal("Punto de Venta", activar.msg);
            }, function(error){
                swal("Punto de Venta", error);
                console.log("Error", error);
            });
        });
    }
}]);