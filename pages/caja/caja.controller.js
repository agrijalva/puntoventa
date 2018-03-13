app.controller("CajaCtrl", ["$scope", "$location","filterFilter","productosFactory", "cajaFactory", function($scope, $location, filterFilter, productosFactory, cajaFactory ) {
    $scope.DataUser     	= JSON.parse( localStorage.getItem("PuntoVentaUserData") );
    $scope.currentUser      = $scope.DataUser.usu_nombre;
    $scope.idCatalogoUsuario = $scope.DataUser.idCatalogoUsuario;
    $scope.selectedProducto = 0;
    $scope.selectedPerson   = 0;
    $scope.sucNombreCorto   = '';
    $scope.sucNombre        = '';

    $scope.idCaja           = 0;
    $scope.Productos        = [];
    $scope.Autocomplete     = [];
    $scope.Carrito          = [];

    $scope.Relleno          = [];
    $scope.RellenoLimit     = 15;

    $scope.procesaCaja      = true;
    $scope.procesaCompra    = false;
    $scope.procesaEntrada   = false;
    $scope.procesaTraspaso  = false;
    $scope.procesaMezcla    = false;
    $scope.procesaGastos    = false;
    $scope.gracias          = false;

    $scope.ventaBool        = false;
    $scope.entradasBool     = false;
    $scope.tarspasoBool     = false;
    $scope.mezclasBool      = false;
    $scope.gastosBool       = false;
    $scope.cajacierreBool   = false;

    $scope.tipoTraspaso     = 1;
    $scope.SucOrigen        = [];
    $scope.SucDestino       = [];
    $scope.idSucOrigen      = 0;
    $scope.idSucDestino     = 0;
    $scope.obs_traspaso     = '';
    $scope.nameSucOrigen    = '';
    $scope.nameSucDestino   = '';

    $scope.caja_monto       = 0;

    $scope.folio            = 0;
    $scope.entrada_observaciones = '';

    $scope.formula          = 0;

    $scope.cantidadMezcla   = 1;
    $scope.obs_mezcla       = '';

    $scope.idTipoGasto      = 0;
    $scope.montoGasto       = 0;
    $scope.motivoGasto      = '';

    $scope.cajaResume = {
        inicial: 0,
        ventas: 0,
        gastos: 0,
        total:0
    }

    $scope.resumen = {
      	subtotal: 0,
      	iva:0,
      	total:0,
      	productos:0
    };

    $scope.init = function(){
    	$scope.cargaProductos();

        if( localStorage.getItem("CurrentCaja") === null || localStorage.getItem("CurrentCaja") == 0 ){
            $scope.idCaja = 0;
        }
        else{
            $scope.idCaja = parseInt( localStorage.getItem("CurrentCaja") );
            $scope.ventaBool   = true;
            $scope.procesaCaja = false;

            // $scope.cajacierreBool   = true;
        }

        var sucursal = filterFilter( $scope.DataUser.sucursales , {idSucursal: $scope.DataUser.idSucursal} );

        $scope.SucOrigen        = filterFilter( $scope.DataUser.sucursales , {idSucursal: '!' + $scope.DataUser.idSucursal} );
        $scope.SucDestino       = sucursal;

        $scope.idSucOrigen      = 0;
        $scope.idSucDestino     = 0;
        // finalizarTraspaso

        sucursal = sucursal[0];
        $scope.sucNombreCorto   = sucursal.suc_nombreCorto;
        $scope.sucNombre   = sucursal.suc_nombre;

        $scope.gastotipo();
    }

    $scope.openModalMezcla = function(){
    	$("#modalMezcla").modal('show');
    }

    $scope.aperturaCaja = function(){
        swal({
            title: "Punto de Venta",
            text: "Monto de inicio de caja",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "1000.00"
        },function(inputValue){
            if (inputValue === false) return false;
              
            if (inputValue === "") {
                swal.showInputError("La caja debe abrirse con un minimo de 1 peso");
                return false
            }            
            else{
                var parametros = {
                    idEmpresa:  parseInt($scope.DataUser.idEmpresa),
                    idSucursal: parseInt($scope.DataUser.idSucursal),
                    idUsuario:  parseInt($scope.DataUser.idUsuario),
                    caja_monto: parseFloat(inputValue)
                }

                cajaFactory.aperturacaja( parametros ).then(function(result){
                    if( result.data.success ){
                        localStorage.setItem("CurrentCaja", parseInt(result.data.LastId));
                        $scope.idCaja      = parseInt(result.data.LastId);
                        $scope.ventaBool   = true;
                        $scope.procesaCaja = false;
                        swal("Punto de Venta", result.data.msg);
                    }
                    else{
                        swal.showInputError( result.data.msg );
                    }

                }, function(error){
                    console.log("Error", error);
                });                 
            }
        });
    }

    $scope.cargaProductos = function(){
        productosFactory.precioventa( $scope.DataUser.idSucursal ).then(function(result){
            //console.log( 'Autocomplete', result );
            $scope.Productos = result.data;
            $scope.Autocomplete = $scope.Productos.data;
        }, function(error){
            console.log("Error", error);
        });         
    }

    $scope.countrySelected = function(selected) {
      	if (selected) {
  			var obj = selected.originalObject;
            var stock = parseFloat(obj.sto_cantidad);
            console.log( "tipoTraspaso", $scope.tipoTraspaso );
            if( parseFloat(stock) <= 0 && ($scope.ventaBool == true || ( $scope.tarspasoBool == true && $scope.tipoTraspaso == 0 ) || $scope.mezclasBool == true ) ){
                swal("Punto de Venta", "No hay existencias del producto: " + obj.pro_nombre);
            }
            else{
                var seleccionado = $scope.Carrito.indexOf( obj );
                console.log( selected.originalObject );
          		if( seleccionado == -1 ){
                    selected.originalObject.cantidad = 1;
            		$scope.Carrito.push( selected.originalObject );
          		}
          		else{
          			var cantidad = parseFloat( $scope.Carrito[seleccionado].cantidad );
          			cantidad = cantidad + 1;
          			$scope.Carrito[seleccionado].cantidad = cantidad.toString();
          		}

          		$scope.resumenVentas();
            }
		    
      	} else {
        	console.log('cleared');
      	}
    };

    $scope.resumenVentas = function(){
    	$scope.resumen		= {
	    	subtotal: 0,
	    	iva:0,
	    	total:0,
	    	productos:0
	    };

  		$scope.Carrito.forEach( function( item, key ){
            if( parseFloat(item.cantidad) > parseFloat(item.sto_cantidad) && ($scope.ventaBool == true || ( $scope.tarspasoBool == true && $scope.tipoTraspaso == 0 ) || $scope.mezclasBool == true)){
                swal("Punto de Venta", "Solo hay " + item.sto_cantidad + " producto(s) en existencia" );
                item.cantidad = item.sto_cantidad;
            }
            else if( parseFloat(item.cantidad) == 0 ){
                console.log("borrar id", key);
                $scope.quitar( key );
            }
            else if( item.cantidad == '' ){
                // item.cantidad = 1;
            }

  			var subtotal = item.cantidad * item.precio_venta;
  			var iva = subtotal * 0.16;
  			$scope.resumen.subtotal  = (parseFloat($scope.resumen.subtotal) + parseFloat( subtotal )).toString();
	    	$scope.resumen.iva 		 = (parseFloat($scope.resumen.iva) + parseFloat( iva )).toString();
	    	$scope.resumen.total 	 = (parseFloat($scope.resumen.iva) + parseFloat( subtotal + iva )).toString();
	    	$scope.resumen.productos = (parseFloat($scope.resumen.productos) + parseFloat( item.cantidad )).toString();
  		});

  		$scope.totalLetra = numeroALetras( $scope.resumen.subtotal, {
		  	plural: 'PESOS',
		  	singular: 'PESO',
		  	centPlural: 'CENTAVOS',
		  	centSingular: 'CENTAVO'
		});

  		$scope.Relleno = [];
		if( $scope.Carrito.length < $scope.RellenoLimit ){
			for (var i = 0; i < ( $scope.RellenoLimit - $scope.Carrito.length ); i++) {
				$scope.Relleno.push(i);
				
			}
		}
    }

    $scope.validaVacios = function( indice ){
        if( $scope.Carrito[indice].cantidad == '' ){
            $scope.Carrito[indice].cantidad = 1;
        }
        else if( isNaN(parseFloat($scope.Carrito[indice].cantidad)) && isFinite($scope.Carrito[indice].cantidad) ){
            $scope.Carrito[indice].cantidad = 1;
        }

        $scope.resumenVentas();
    }

    $scope.localSearch = function(str, people) {
      	var matches = [];
      	people.forEach(function(person) { // pro_sku, pro_nombre
        	var fullName = person.pro_sku + ' ' + person.pro_nombre;
        	if ((person.pro_sku.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
            	(person.pro_nombre.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
            	(fullName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {
	          	matches.push(person);
	        }
      	});
      	return matches;
    };

    $scope.quitar = function( indice ){
    	$scope.Carrito.splice(indice, 1);
    	$scope.resumenVentas();
    }

    $scope.procesarCompra = function(){
        var fecha = new Date();
        var mes = (fecha.getMonth()+1) < 10 ? '0' + (fecha.getMonth()+1) : (fecha.getMonth()+1);
        var dia = fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate();
        $scope.fechaStr = fecha.getFullYear()+"/"+mes+"/"+dia;

    	if( $scope.Carrito.length == 0 ){
    		swal("Punto de Venta", "No hay productos agregados")
    	}
    	else{
	    	$scope.procesaCompra = true;
	    	$scope.recibo = '';

	    	setTimeout( function(){
	    		$("#input-recibo").focus();
	    	}, 500);
    	}
    }

    $scope.procesarEntrada = function(){
        var fecha = new Date();
        var mes = (fecha.getMonth()+1) < 10 ? '0' + (fecha.getMonth()+1) : (fecha.getMonth()+1);
        var dia = fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate();
        $scope.fechaStr = fecha.getFullYear()+"/"+mes+"/"+dia;

        if( $scope.Carrito.length == 0 ){
            swal("Punto de Venta", "No hay productos agregados")
        }
        else{
            $scope.procesaEntrada = true;
            $scope.recibo = '';

            setTimeout( function(){
                $("#input-recibo").focus();
            }, 500);
        }
    }

    $scope.procesarTraspaso = function(){
        var fecha = new Date();
        var mes = (fecha.getMonth()+1) < 10 ? '0' + (fecha.getMonth()+1) : (fecha.getMonth()+1);
        var dia = fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate();
        $scope.fechaStr = fecha.getFullYear()+"/"+mes+"/"+dia;

        if( $scope.Carrito.length == 0 ){
            swal("Punto de Venta", "No hay productos agregados")
        }
        else{
            if( $scope.idSucOrigen == 0 ){
                swal("Punto de Venta", "Porporciona la sucursal Origen");
            }
            else if( $scope.idSucDestino == 0 ){
                swal("Punto de Venta", "Porporciona la sucursal Destino");
            }
            else if( $scope.obs_traspaso == '' ){
                swal("Punto de Venta", "Porporciona una observacion para este traspaso");
            }
            else{
                console.log("idSucOrigen", $scope.idSucOrigen);
                console.log("idSucDestino", $scope.idSucDestino);

                var suc = filterFilter( $scope.DataUser.sucursales , {idSucursal: $scope.idSucOrigen} );
                $scope.nameSucOrigen    = suc[0].suc_nombre;

                var suc = filterFilter( $scope.DataUser.sucursales , {idSucursal: $scope.idSucDestino} );
                $scope.nameSucDestino   = suc[0].suc_nombre;

                $scope.procesaTraspaso  = true;
                $scope.recibo = '';

                setTimeout( function(){
                    $("#input-recibo").focus();
                }, 500);
            }
        }
    }

    $scope.procesarMezcla = function(){
        var fecha = new Date();
        var mes = (fecha.getMonth()+1) < 10 ? '0' + (fecha.getMonth()+1) : (fecha.getMonth()+1);
        var dia = fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate();
        $scope.fechaStr = fecha.getFullYear()+"/"+mes+"/"+dia;

        if( $scope.Carrito.length == 0 ){
            swal("Punto de Venta", "No hay productos agregados")
        }
        else{
            if( $scope.formula == 0 ){
                swal("Punto de Venta", "Porporciona el producto resultante de esta mezcla");
            }
            else if( $scope.cantidadMezcla == 0 ){
                swal("Punto de Venta", "Porporciona la cantidad resultante");
            }
            else if( $scope.obs_mezcla == '' ){
                swal("Punto de Venta", "Porporciona una observacion para esta mezcla");
            }
            else{
                $scope.procesaMezcla    = true;
                $scope.recibo = '';

                $scope.nombreformula = filterFilter( $scope.Autocomplete , {idProducto: $scope.formula}, true );
                console.log( "formula", $scope.formula );
                console.log( "Autocomplete", $scope.Autocomplete );
                console.log( "nombreformula", $scope.nombreformula );

                setTimeout( function(){
                    $("#input-recibo").focus();
                }, 500);                
            }
        }
    }    

    $scope.finalizarCompra = function(){
        var cabecera = {
            cho_descripcion: 'Venta de mostrador',
            idUsuario:  parseInt($scope.DataUser.idUsuario),
            idEmpresa:  parseInt($scope.DataUser.idEmpresa),
            idSucursal: parseInt($scope.DataUser.idSucursal),
            idCaja:     $scope.idCaja,
            idCliente:  1,
            ven_monto:  $scope.resumen.subtotal
        }

        var incremental = 0;

        cajaFactory.ventacabecera( cabecera ).then(function(result){
            var header = result.data;
            $scope.Carrito.forEach( function( item, key ){
                var detalle = {
                    idCheckOut: header.LastId,
                    idProducto: item.idProducto,
                    cod_cantidad: item.cantidad,
                    cod_precio: item.precio_venta,
                    cod_observaciones: ''
                }
                $scope.folio = header.folio;

                cajaFactory.ventadetalle( detalle ).then(function(result){
                    if( result.length != 0 ){
                        incremental++;
                        if( incremental == ($scope.Carrito.length) ){
                            $scope.print('notaVenta');                            

                            $scope.procesaCompra = false;
                            $scope.Carrito = [];
                            $scope.resumen       = {
                                subtotal: 0,
                                iva:0,
                                total:0,
                                productos:0
                            };

                            $scope.cargaProductos();
                        }
                    }
                }, function(error){
                    console.log("Error", error);
                }); 
            });

        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.finalizarEntrada = function(){
        var cabecera = {
            cho_descripcion: $scope.entrada_observaciones,
            idUsuario:  parseInt($scope.DataUser.idUsuario),
            idEmpresa:  parseInt($scope.DataUser.idEmpresa),
            idSucursal: parseInt($scope.DataUser.idSucursal)
        }

        var incremental = 0;

        cajaFactory.entradacabecera( cabecera ).then(function(result){
            var header = result.data;
            $scope.Carrito.forEach( function( item, key ){
                var detalle = {
                    idCheckIn: header.LastId,
                    idProducto: item.idProducto,
                    cod_cantidad: item.cantidad,
                    cod_observaciones: item.entrada_descripcion
                }
                $scope.folio = header.folio;

                cajaFactory.entradadetalle( detalle ).then(function(result){
                    if( result.length != 0 ){
                        incremental++;
                        if( incremental == ($scope.Carrito.length) ){
                            $scope.print('notaEntrada');

                            $scope.procesaEntrada = false;
                            $scope.Carrito = [];
                            $scope.resumen       = {
                                subtotal: 0,
                                iva:0,
                                total:0,
                                productos:0
                            };

                            $scope.cargaProductos();
                        }
                    }
                }, function(error){
                    console.log("Error", error);
                }); 
            });

        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.finalizarTraspaso = function(){
        if( $scope.idSucOrigen == 0 ){
            swal("Punto de Venta", "Porporciona la sucursal Origen");
        }
        else if( $scope.idSucDestino == 0 ){
            swal("Punto de Venta", "Porporciona la sucursal Destino");
        }
        else if( $scope.obs_traspaso == '' ){
            swal("Punto de Venta", "Porporciona una observacion para este traspaso");
        }
        else{
            var cabecera = {
                cho_descripcion: $scope.obs_traspaso,
                idUsuario:  parseInt($scope.DataUser.idUsuario),
                idEmpresa:  parseInt($scope.DataUser.idEmpresa),
                idSucursal: parseInt($scope.DataUser.idSucursal),
                Tipo:  $scope.tipoTraspaso,
                sucOrigen:  parseInt($scope.idSucOrigen),
                sucDestino: parseInt($scope.idSucDestino)
            }

            var incremental = 0;

            cajaFactory.traspasocabecera( cabecera ).then(function(result){
                var header = result.data;
                $scope.Carrito.forEach( function( item, key ){
                    var detalle = {
                        CheckId: header.LastId,
                        idProducto: item.idProducto,
                        cod_cantidad: item.cantidad,
                        cod_observaciones: item.entrada_descripcion,
                        Tipo: $scope.tipoTraspaso,
                        idTraspado: header.Traspaso
                    }
                    $scope.folio = header.folio;

                    cajaFactory.traspasodadetalle( detalle ).then(function(result){
                        if( result.length != 0 ){
                            incremental++;
                            if( incremental == ($scope.Carrito.length) ){
                                $scope.print('notaTraspaso');

                                $scope.procesaTraspaso = false;
                                $scope.Carrito = [];
                                $scope.resumen       = {
                                    subtotal: 0,
                                    iva:0,
                                    total:0,
                                    productos:0
                                };

                                $scope.tipoTraspaso = 1;
                                $scope.idSucOrigen  = 0;
                                $scope.idSucDestino = 0;
                                $scope.obs_traspaso = '';

                                $scope.cargaProductos();
                            }
                        }
                    }, function(error){
                        console.log("Error", error);
                    }); 
                });

            }, function(error){
                console.log("Error", error);
            });
        }
    }

    $scope.finalizarMezcla = function(){
        var cabecera = {
            cho_descripcion: $scope.obs_mezcla,
            idUsuario:  parseInt($scope.DataUser.idUsuario),
            idEmpresa:  parseInt($scope.DataUser.idEmpresa),
            idSucursal: parseInt($scope.DataUser.idSucursal)
        }

        var incremental = 0;

        cajaFactory.mezclacabecera( cabecera ).then(function(result){
            var header = result.data;
            var detalleIn = {
                idCheckIn:          header.idCheckIn,
                idProducto:         parseInt($scope.formula),
                cod_cantidad:       $scope.cantidadMezcla,
                cod_observaciones:  $scope.obs_mezcla
            }

            cajaFactory.mezclaindetalle( detalleIn ).then(function(result){
                if( result.length != 0 ){
                    console.log("Entrada", result);
                }
            }, function(error){
                console.log("Error", error);
            }); 


            $scope.Carrito.forEach( function( item, key ){
                var detalle = {
                    idCheckOut: header.idCheckOut,
                    idProducto: item.idProducto,
                    cod_cantidad: item.cantidad,
                    cod_observaciones: item.entrada_descripcion
                }

                $scope.folio = header.folio;

                cajaFactory.mezclaoutdetalle( detalle ).then(function(result){
                    if( result.length != 0 ){
                        incremental++;
                        if( incremental == ($scope.Carrito.length) ){
                            $scope.print('notaMezcla');

                            $scope.procesaMezcla = false;
                            $scope.Carrito = [];
                            $scope.resumen       = {
                                subtotal: 0,
                                iva:0,
                                total:0,
                                productos:0
                            };

                            $scope.formula          = 0;
                            $scope.cantidadMezcla   = 0;
                            $scope.obs_mezcla       = '';

                            $scope.cargaProductos();
                        }
                    }
                }, function(error){
                    console.log("Error", error);
                }); 
            });

        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.print = function( id ){
        switch( id ){
            case 'notaVenta':
                swal("Punto de Venta", "Gracias por su compra");
                break;
            case 'notaEntrada':
                swal("Punto de Venta", "Entrada registrada correctamente");
                break;
            case 'notaTraspaso':
                swal("Punto de Venta", "Traspaso registrado correctamente");
                break;
            case 'notaMezcla':
                swal("Punto de Venta", "Mezcla registrada correctamente");
                break;
        }
        
        var ficha = $('#' + id).html();
        var ventimp = window.open(' ', 'popimpr');
        ventimp.document.write( ficha );
        ventimp.document.close();
        ventimp.print();
        ventimp.close();
    }

    $scope.procesarCancel = function(){
    	$scope.procesaCompra   = false;
        $scope.procesaEntrada  = false;
        $scope.procesaTraspaso = false;
        $scope.procesaMezcla   = false;
    }

    $scope.getFecha = function(){
    	var dt = new Date();

		var month = dt.getMonth()+1;
		var day = dt.getDate();
		var year = dt.getFullYear();
		var meses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
		var dias = ["Domingo", "Lunes", "Martes", "Miercoles", "jueves", "Viernes", "Sabado"];

		return day +' de '+ meses[month] + ' del ' + year;
    }

    $scope.showPVenta = function(){
        if( $scope.idCaja == 0 ){
            $scope.procesaCaja    = true;
            $scope.entradasBool   = false;
            $scope.tarspasoBool   = false;
            $scope.mezclasBool    = false;
            $scope.cajacierreBool = false;
        }
        else{
            $scope.entradasBool   = false;
            $scope.tarspasoBool   = false;
            $scope.mezclasBool    = false;
            $scope.cajacierreBool = false;
        	$scope.ventaBool 	  = true;

            $scope.procesaCompra = false;
            $scope.Carrito = [];
            $scope.resumen       = {
                subtotal: 0,
                iva:0,
                total:0,
                productos:0
            };

            $scope.cargaProductos();            
        }
    }

    $scope.showEntradas = function(){
        $scope.procesaCaja    = false;
    	$scope.ventaBool 	  = false;
        $scope.tarspasoBool   = false;
        $scope.mezclasBool    = false;
        $scope.cajacierreBool = false;
    	$scope.entradasBool   = true;

        $scope.procesaCompra = false;
        $scope.Carrito = [];
        $scope.resumen       = {
            subtotal: 0,
            iva:0,
            total:0,
            productos:0
        };

        $scope.cargaProductos();
    }

    $scope.showTraspasos = function(){
        $scope.procesaCaja    = false;
        $scope.ventaBool      = false;
        $scope.entradasBool   = false;
        $scope.mezclasBool    = false;
        $scope.cajacierreBool = false;
        $scope.tarspasoBool   = true;

        $scope.procesaCompra = false;
        $scope.Carrito = [];
        $scope.resumen       = {
            subtotal: 0,
            iva:0,
            total:0,
            productos:0
        };

        $scope.cargaProductos();
    }

    $scope.showMexclas = function(){
        $scope.procesaCaja      = false;
        $scope.ventaBool        = false;
        $scope.entradasBool     = false;
        $scope.tarspasoBool     = false;
        $scope.cajacierreBool   = false;
        $scope.mezclasBool      = true;

        $scope.procesaCompra = false;
        $scope.Carrito = [];
        $scope.resumen       = {
            subtotal: 0,
            iva:0,
            total:0,
            productos:0
        };

        $scope.cargaProductos();
    }

    $scope.showGastos = function(){
        $scope.ventaBool        = false;
        $scope.entradasBool     = false;
        $scope.tarspasoBool     = false;
        $scope.mezclasBool      = false;
        $scope.cajacierreBool   = false;
        $scope.gastosBool       = true;

        $scope.procesaGastos    = false;
        $scope.Carrito = [];
        $scope.resumen       = {
            subtotal: 0,
            iva:0,
            total:0,
            productos:0
        };

        $scope.cargaProductos();
        $scope.cajaresumen();
    }

    $scope.showCierreCaja = function(){
        $scope.ventaBool        = false;
        $scope.entradasBool     = false;
        $scope.tarspasoBool     = false;
        $scope.mezclasBool      = false;
        $scope.gastosBool       = false;
        $scope.cajacierreBool   = true;

        $scope.procesaGastos    = false;
        $scope.Carrito = [];
        $scope.resumen       = {
            subtotal: 0,
            iva:0,
            total:0,
            productos:0
        };

        $scope.cargaProductos();
        $scope.cajaresumen();
        $scope.cajacierre();
    }

    $scope.traspasoTipo = function(){
        console.log( $scope.tipoTraspaso );
        if( $scope.tipoTraspaso == 1 ){
            $scope.SucDestino       = $scope.SucOrigen;
            $scope.SucOrigen        = filterFilter( $scope.DataUser.sucursales , {idSucursal: '!' + $scope.DataUser.idSucursal} );
        }
        else if( $scope.tipoTraspaso == 0 ){
            $scope.SucOrigen        = $scope.SucDestino;
            $scope.SucDestino       = filterFilter( $scope.DataUser.sucursales , {idSucursal: '!' + $scope.DataUser.idSucursal} );
        }
        
        $scope.idSucOrigen      = 0;
        $scope.idSucDestino     = 0;

        $scope.resumenVentas();
    }

    $scope.registrarGasto = function(){
        swal({
            title: "Punto de Ventata",
            text: '¿Desea registrar este gasto?',
            showCancelButton: true,
            closeOnConfirm: false,
            cancelButtonText: 'No',
            confirmButtonText: 'Si, Guardar!',
            showLoaderOnConfirm: false
        }, function () {
            var parametros = {
                monto: $scope.montoGasto,
                descripcion: $scope.motivoGasto,
                gastoTipo: parseInt($scope.idTipoGasto),
                caja: $scope.idCaja
            }

            cajaFactory.registrogasto( parametros ).then(function(result){
                var registro = result.data;
                if( registro.success ){
                    $scope.montoGasto  = 0;
                    $scope.motivoGasto = '';
                    $scope.idTipoGasto = 0;

                    $scope.cajaresumen();
                }

                swal("Punto de venta", registro.msg);
            }, function(error){
                console.log("Error", error);
            });
        });
    }

    $scope.gastotipo = function(){
        cajaFactory.gastotipo().then(function(result){
            $scope.tipoGasto = result.data;
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.cajaresumen = function(){
        cajaFactory.cajaresumen( $scope.idCaja ).then(function(result){
            $scope.cajaDetalle = result.data;

            $scope.cajaResume = {
                inicial: $scope.cajaDetalle.data[0].montoInicial,
                ventas: ( $scope.cajaDetalle.data[0].ventas === null ) ? 0 : $scope.cajaDetalle.data[0].ventas,
                gastos: ( $scope.cajaDetalle.data[0].gastos === null ) ? 0 : $scope.cajaDetalle.data[0].gastos,
                total: ( $scope.cajaDetalle.data[0].total === null ) ? 0 : $scope.cajaDetalle.data[0].total
            }

            console.log( $scope.cajaResume );
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.cajacierre = function(){
        $scope.caja = {}

        cajaFactory.cajacierre( $scope.idCaja, 1 ).then(function(result){
            $scope.caja.caja = result.data;
            console.log( $scope.caja.caja );
        })

        cajaFactory.cajacierre( $scope.idCaja, 2 ).then(function(result){
            $scope.caja.ventas = result.data;
            console.log( $scope.caja.ventas );
        })

        cajaFactory.cajacierre( $scope.idCaja, 3 ).then(function(result){
            $scope.caja.gastos = result.data;
            console.log( $scope.caja.gastos );
        })

        $scope.idCajaTMP = $scope.idCaja;
        localStorage.setItem("CurrentCaja", 0);
        $scope.idCaja = 0;

    }

    $scope.setfechacierre = function(){
        swal({
            title: "Punto de Ventata",
            text: '¿Desea cerrar la caja en este momento?',
            showCancelButton: true,
            closeOnConfirm: false,
            cancelButtonText: 'No',
            confirmButtonText: 'Si',
            showLoaderOnConfirm: false
        }, function () {
            cajaFactory.setfechacierre( $scope.idCaja ).then(function(result){                
                swal("Punto de venta", "La caja se ha cerrado correctamente");
                $scope.showCierreCaja();
            }, function(error){
                console.log("Error", error);
            });
        });
    }

    $scope.modalVentas = function(){
        // var fecha = new Date();
        // var anio = fecha.getFullYear();
        // var mes = (fecha.getMonth()+1);
        // var dia = fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate();
        // var hora = fecha.getHours() < 10 ? '0' + fecha.getHours() : fecha.getHours();
        // var segundo = fecha.getMinutes() < 10 ? '0' + fecha.getMinutes() : fecha.getMinutes();
        
        // document.getElementById("fecha_str").innerHTML = anio + "/" + mes + "/" +  dia + " " + hora + ":" + segundo;
        cajaFactory.productosvendidos( $scope.idCajaTMP ).then(function(result){
            $scope.ventasDetalle = result.data;

            if( $scope.ventasDetalle ){
                $("#myModal").modal('show');                
            }
            else{
                swal("Punto de Venta", "Ocurrio un error al intentar obtener la información");
            }
            

            console.log( $scope.ventasDetalle );
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.numero0 = function(num){
        var long = 6;
        numtmp = '"' + num + '"';
        largo = numtmp.length - 2;
        numtmp = numtmp.split('"').join('');
        if( largo == long ) return numtmp;
        ceros = '';
        pendientes = long - largo;
        for( i = 0; i < pendientes; i++ ) ceros+='0';
        return ceros+numtmp;
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