var Path_Producto  = API_Path + '/producto/';
var Path_Caja      = API_Path + '/caja/';
var Path_Checkout  = API_Path + '/checkout/';
var Path_Checkin   = API_Path + '/checkin/';
var Path_Gasto     = API_Path + '/gasto/';

app.factory( 'cajaFactory', function( $http ){
	return {
        muestra: function( idEmpresa ) {
            return $http({
                url: Path_Producto + 'muestra/',
                method: "POST",
                params: {
                    idEmpresa: idEmpresa
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        precioventa: function( idSucursal ) {
            return $http({
                url: Path_Producto + 'precioventa/',
                method: "POST",
                params: {
                    idSucursal: idSucursal
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        aperturacaja: function( params ) {
            return $http({
                url: Path_Caja + 'apertura/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        ventacabecera: function( params ) {
            return $http({
                url: Path_Checkout + 'ventacabecera/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        ventadetalle: function( params ) {
            return $http({
                url: Path_Checkout + 'ventadetalle/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        entradacabecera: function( params ) {
            return $http({
                url: Path_Checkin + 'entradacabecera/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        entradadetalle: function( params ) {
            return $http({
                url: Path_Checkin + 'entradadetalle/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        traspasocabecera: function( params ) {
            return $http({
                url: Path_Checkin + 'traspasocabecera/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        traspasodadetalle: function( params ) {
            return $http({
                url: Path_Checkin + 'traspasodadetalle/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        mezclacabecera: function( params ) {
            return $http({
                url: Path_Checkin + 'mezclacabecera/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        mezclaindetalle: function( params ) {
            return $http({
                url: Path_Checkin + 'mezclaindetalle/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        mezclaoutdetalle: function( params ) {
            return $http({
                url: Path_Checkin + 'mezclaoutdetalle/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        gastotipo: function() {
            return $http({
                url: Path_Gasto + 'tipo/',
                method: "POST",
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        registrogasto: function( params ) {
            return $http({
                url: Path_Gasto + 'registro/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        cajaresumen: function( idCaja ) {
            return $http({
                url: Path_Caja + 'resumen/',
                method: "POST",
                params: {
                    idCaja: idCaja
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        productosvendidos: function( idCaja ) {
            return $http({
                url: Path_Caja + 'productosvendidos/',
                method: "POST",
                params: {
                    idCaja: idCaja
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        cajacierre: function( idCaja, tipo ) {
            return $http({
                url: Path_Caja + 'cierre/',
                method: "POST",
                params: {
                    idCaja: idCaja,
                    tipo: tipo
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        setfechacierre: function( idCaja ) {
            return $http({
                url: Path_Caja + 'setfechacierre/',
                method: "POST",
                params: {
                    idCaja: idCaja
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});