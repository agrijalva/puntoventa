var Path_Inventario = API_Path + '/inventario/';

app.factory( 'inventariosFactory', function( $http ){
	return {
        detalle: function( idInventario ) {
            return $http({
                url: Path_Inventario + 'detalle/',
                method: "POST",
                params: {
                    idInventario: idInventario
                },
                headers: {
                	// 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        mostrartodos: function( idEmpresa ) {
            return $http({
                url: Path_Inventario + 'mostrar/',
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

        aperturar: function( params ) {
            return $http({
                url: Path_Inventario + 'aperturar/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        modificar: function( params ) {
            return $http({
                url: Path_Inventario + 'modificar/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        stockInventario: function( idEmpresa, idSucursal ) {
            return $http({
                url: Path_Inventario + 'stockInventario/',
                method: "POST",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        
        registrarInventario: function( params ) {
            return $http({
                url: Path_Inventario + 'registrarInventario/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        cerrar: function( idInventario ) {
            return $http({
                url: Path_Inventario + 'cerrar/',
                method: "POST",
                params: {
                    idInventario: idInventario
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        eliminar: function( idInventario ) {
            return $http({
                url: Path_Inventario + 'eliminar/',
                method: "POST",
                params: {
                    idInventario: idInventario
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        activar: function( idInventario ) {
            return $http({
                url: Path_Inventario + 'activar/',
                method: "POST",
                params: {
                    idInventario: idInventario
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});