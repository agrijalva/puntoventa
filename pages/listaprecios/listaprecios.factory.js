var Path_Producto   = API_Path + '/producto/';
var Path_Lista      = API_Path + '/precio/';

app.factory( 'listaPreciosFactory', function( $http ){
    return {
        productos: function( idEmpresa, idListaPrecio ) {
            return $http({
                url: Path_Lista + 'productoprecio/',
                method: "POST",
                params: {
                    idEmpresa: idEmpresa,
                    idListaPrecio: idListaPrecio
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },

        detalle: function( idListaPrecio ) {
            return $http({
                url: Path_Lista + 'listaspreciodetalle/',
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

        registrar: function( params ) {
            return $http({
                url: Path_Lista + 'listaprecioregistrar/',
                method: "POST",
                params: params,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});