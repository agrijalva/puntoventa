var Path_Producto = API_Path + '/producto/';

app.factory( 'productosFactory', function( $http ){
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

        nuevo: function( params ) {
            return $http({
                url: Path_Producto + 'nuevo/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        editar: function( params ) {
            return $http({
                url: Path_Producto + 'editar/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        
        eliminar: function( idProducto ) {
            return $http({
                url: Path_Producto + 'eliminar/',
                method: "POST",
                params: {
                    idProducto: idProducto
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});