var Path_Precio = API_Path + '/precio/';

app.factory( 'preciosFactory', function( $http ){
    return {
        listasprecio: function( idEmpresa ) {
            return $http({
                url: Path_Precio + 'listasprecio/',
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

        listaprecionueva: function( params ) {
            return $http({
                url: Path_Precio + 'listaprecionueva/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        listaprecioeditar: function( params ) {
            return $http({
                url: Path_Precio + 'listaprecioeditar/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        
        listaprecioeliminar: function( idListaPrecio ) {
            return $http({
                url: Path_Precio + 'listaprecioeliminar/',
                method: "POST",
                params: {
                    idListaPrecio: idListaPrecio
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        // listaprecioregistrar: function( params ) {
        //     return $http({
        //         url: Path_Precio + 'listaprecioeliminar/',
        //         method: "POST",
        //         params: params,
        //         headers: {
        //             // 'Authorization': Authorization,
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // },

        listaprecioactivar: function( idListaPrecio ) {
            return $http({
                url: Path_Precio + 'activar/',
                method: "POST",
                params: {
                    idListaPrecio: idListaPrecio
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});