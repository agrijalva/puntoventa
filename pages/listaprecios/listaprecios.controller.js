app.controller("ListapreciosCtrl", ["$scope", "$location","filterFilter", "listaPreciosFactory", function($scope, $location, filterFilter, listaPreciosFactory) {
    $scope.DataUser = JSON.parse( localStorage.getItem("PuntoVentaUserData") );

    $scope.search       = '';
    $scope.Productos    = [];
    $scope.successLista = null;

    $scope.init = function(){
    	$scope.cargaProductos();
    	$scope.cargaDetalle();
    }

    $scope.cargaProductos = function(){
    	listaPreciosFactory.productos( $scope.DataUser.idEmpresa, localStorage.getItem("LastIdListaPrecios") ).then(function(result){
            $scope.Productos = result.data;
            $scope.Productos.data.forEach(function(item, key) {
                $scope.Productos.data[key].precioVenta       = item.precioVenta === null ? '': $scope.formatMoney( item.precioVenta, 2, '.', '');
                $scope.Productos.data[key].precioCosto       = $scope.formatMoney( item.precioCosto, 2, '.', '');
                $scope.Productos.data[key].precioVentaPrevio = $scope.formatMoney( item.precioVentaPrevio, 2, '.', '');
            });
            $scope.toogle();
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.cargaDetalle = function(){
    	listaPreciosFactory.detalle( localStorage.getItem("LastIdListaPrecios") ).then(function(result){
            $scope.Detalle = result.data;

            if( $scope.Detalle.success ){
                $scope.tituloLista = $scope.Detalle.data[0].lpr_nombre + ' / ' + $scope.Detalle.data[0].suc_nombre;
                $scope.successLista = $scope.Detalle.data[0].successLista;
            }
            else{
            	$location.path("/admin/precios");
            	swal({
		            title: 'Punto de Venta',
		            text: "No se ha detectado una lista de precios a editar.",
		            showCancelButton: false,
		            confirmButtonColor: '#3085d6',
		            cancelButtonColor: '#d33',
		            confirmButtonText: 'Ok',
		            closeOnConfirm: true
		        },
		        function(){
		        });
            }
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.guardarPrecios = function(){
        swal({
            title: "Punto de Ventata",
            text: '¿Desea guardar esta lista de precios?',
            showCancelButton: true,
            closeOnConfirm: false,
            cancelButtonText: 'No',
            confirmButtonText: 'Si, Guardar!',
            showLoaderOnConfirm: true
        }, function () {
            var precioCosto = 0;
            var precioVenta = 0;
            var parametros  = {
                idListaPrecio:  0,
                idProducto:     0,
                precioCompra:   0,
                precioVenta:    0
            };
            var contador = 0;
            
            $scope.Productos.data.forEach(function(item, key) {
                $scope.Productos.data[ key ].request = null;                
                precioCosto += parseFloat( $scope.Productos.data[key].precioCosto );
                precioVenta += parseFloat( $scope.Productos.data[key].precioVenta );
            });

            if( precioVenta == 0 ){
                swal("Punto de Venta", "La lista de precios esta vacía, de esta forma no puede ser guardada.");
            }
            else{

                $scope.Productos.data.forEach(function(item, key) {

                    parametros  = {
                        idListaPrecio:  localStorage.getItem("LastIdListaPrecios"),
                        idProducto:     $scope.Productos.data[key].idProducto,
                        precioCompra:   $scope.Productos.data[key].precioCosto,
                        precioVenta:    $scope.Productos.data[key].precioVenta
                    };

                    listaPreciosFactory.registrar( parametros ).then(function(result){
                        $scope.Productos.data[ key ].request = result;
                        contador++;
                        if( contador == $scope.Productos.data.length ){
                            swal("Punto de Venta", "Precios para " + $scope.tituloLista + " agregados.");
                            // localStorage.setItem("LastIdListaPrecios", 0);
                            // $location.path("/admin/precios");
                            
                        }
                        $scope.toogle();
                    }, function(error){
                        console.log("Error", error);
                    }); 

                });
			}
        });
    }

    $scope.cargaPrecioAnterior = function(){
        $scope.Productos.data.forEach(function(item, key) {
            $scope.Productos.data[key].precioVenta = $scope.formatMoney( $scope.Productos.data[key].precioVentaPrevio,2 , '.', '');
        });
    }

    $scope.formatMoney = function(val, c, d, t){
        var n = val, 
            c = isNaN(c = Math.abs(c)) ? 2 : c, 
            d = d == undefined ? "." : d, 
            t = t == undefined ? "," : t, 
            s = n < 0 ? "-" : "", 
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
            j = (j = i.length) > 3 ? j % 3 : 0;
           return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    $scope.toogle = function(){
        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip(); 
        });
    }
}]);

