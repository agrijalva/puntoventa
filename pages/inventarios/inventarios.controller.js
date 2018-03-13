app.controller("InventariosCtrl", ["$scope", "$location","filterFilter", "inventariosFactory", function($scope, $location, filterFilter, inventariosFactory) {
    $scope.DataUser          = JSON.parse( localStorage.getItem("PuntoVentaUserData") );
    $scope.idCatalogoUsuario = $scope.DataUser.idCatalogoUsuario;
    $scope.search            = '';

    $scope.inv_nombre        = '';
    $scope.inv_descripcion   = '';

    $scope.idEmpresa         = 0;
    $scope.idSucursal        = 0;
    $scope.idProducto        = 0;
    $scope.idInventario      = 0;

    $scope.init = function(){
        $scope.mostrarInventarios();
    }

    $scope.initDetalle = function(){
        $scope.mostrarDetalle();
    }

    $scope.formatoInventarioModal = function(){
        var fecha = new Date();
        var anio = fecha.getFullYear();
        var mes = (fecha.getMonth()+1);
        var dia = fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate();
        var hora = fecha.getHours() < 10 ? '0' + fecha.getHours() : fecha.getHours();
        var segundo = fecha.getMinutes() < 10 ? '0' + fecha.getMinutes() : fecha.getMinutes();
        
        document.getElementById("fecha_str").innerHTML = anio + "/" + mes + "/" +  dia + " " + hora + ":" + segundo;

        $("#myModal").modal('show');
    }

    $scope.Detalle = [];
    $scope.mostrarDetalle = function(){
        inventariosFactory.detalle( localStorage.getItem("LastIdInventario") ).then(function(result){
            $scope.Detalle = result.data;
            $scope.Titulo  = $scope.Detalle.data[0].inv_nombre + ' / ' + $scope.Detalle.data[0].suc_nombre;

            $scope.muestraInventarioDetalle();
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.mostrarInventarios = function(){
        inventariosFactory.mostrartodos( $scope.DataUser.idEmpresa ).then(function(result){
            $scope.Inventarios = result.data;
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.muestraInventarioDetalle = function(){
        inventariosFactory.stockInventario( $scope.DataUser.idEmpresa, $scope.Detalle.data[0].idSucursal ).then(function(result){
            $scope.stockInventario = result.data;
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.incremental = 0;
    $scope.registrarInventario = function(){
        swal({
            title: "Punto de Ventata",
            text: "¿Desea guardar el inventario?",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $scope.guardandoInventario();
        });
    }

    $scope.guardandoInventario = function(){
        var item = $scope.stockInventario.data[ $scope.incremental ];
        var parametros = {
                idInventario:   localStorage.getItem("LastIdInventario"),
                descripcion:    item.descripcion,
                cantidad:       item.cantidadFisico,
                idProducto:     item.idProducto
            }
        
        inventariosFactory.registrarInventario( parametros ).then(function(result){
            var insercion = result.data;
            $scope.stockInventario.data[ $scope.incremental ].request = result;
            console.log("insercion",insercion);

            if( insercion.success == 1 ){
                if( insercion.length != 0 ){
                    $scope.incremental++;

                    if( $scope.incremental < $scope.stockInventario.data.length ){
                        $scope.guardandoInventario();
                    }
                    else{
                        $scope.mostrarDetalle();
                        $scope.incremental = 0;
                        swal("Punto de Venta", "Guardado correctamente");
                    }
                }
            }
            else{
                swal("Punto de Venta", insercion.msg);
            }
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.openModalAperturar = function(){
        $scope.inv_nombre       = '';
        $scope.inv_descripcion  = '';
        $scope.idSucursal       = 0;

        $("#myModal").modal('show');
    }

    $scope.openModalEditar = function( index ){
        var inv = $scope.Inventarios.data[index];
        $scope.inv_nombre       = inv.inv_nombre;
        $scope.inv_descripcion  = inv.inv_descripcion;
        $scope.idSucursal       = inv.idSucursal;
        $scope.idInventario     = inv.idInventario;

        $("#myModalEditar").modal('show');
    }

    $scope.crearApertura = function(){
        var parametros = {
            inv_nombre:         $scope.inv_nombre,
            inv_descripcion:    $scope.inv_descripcion,
            idSucursal:         $scope.idSucursal,
            idEmpresa:          $scope.DataUser.idEmpresa,
            idUsuario:          $scope.DataUser.idUsuario
        }

        inventariosFactory.aperturar( parametros ).then(function(result){
            var nuevo = result.data;
            if( nuevo.success ){
                $scope.mostrarInventarios();
                
                localStorage.setItem("LastIdInventario", nuevo.LastId);
                $("#myModal").modal('hide');
                
                $location.path("/admin/registroinventario");
            }
            swal("Punto de Venta", nuevo.msg);
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.modificarCabeceras = function(){
        var parametros = {
            idInventario:       $scope.idInventario,
            inv_nombre:         $scope.inv_nombre,
            inv_descripcion:    $scope.inv_descripcion
        }

        inventariosFactory.modificar( parametros ).then(function(result){
            var nuevo = result.data;
            if( nuevo.success ){
                $scope.mostrarInventarios();
                
                $("#myModalEditar").modal('hide');
            }
            swal("Punto de Venta", nuevo.msg);
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.modalAjuste = function(){
        $("#myModalAjuste").modal('show');
    }

    $scope.nuevaLista = function(){
        $("#myModal").modal('hide');
    	$location.path("/admin/listaprecios");
    }

    $scope.verStock = function(){
        $("#myModalStock").modal('hide');
        $location.path("/admin/stock");
    }

    $scope.verInventario = function( idInventario ){
        localStorage.setItem("LastIdInventario", idInventario);
        $location.path("/admin/registroinventario");
    }

    $scope.printFormato = function() {
        var ficha = document.getElementById('formatoInventario');
        var ventimp = window.open(' ', 'popimpr');
        ventimp.document.write( ficha.innerHTML );
        ventimp.document.close();
        ventimp.print( );
        ventimp.close();
    }
}]);