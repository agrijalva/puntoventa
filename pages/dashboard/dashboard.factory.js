var Path_Ejecutivo = API_Path + '/ejecutivo/';
var Path_Cliente = API_Path + '/cliente/';
var Path_Correos = API_Path + '/correos/';

app.factory( 'agenteFactory', function( $http ){
	return {
        getAgentes: function( emp_id, eje_id ) {
            return $http({
                url: Path_Ejecutivo + 'getEjecutivos/',
                method: "POST",
                params: {
                    emp_id: emp_id,
                    eje_id: eje_id
                },
                headers: {
                	// 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        getByArea: function( emp_id, idArea ) {
            return $http({
                url: Path_Ejecutivo + 'getByAreas/',
                method: "POST",
                params: {
                    emp_id: emp_id,
                    idArea: idArea
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        getByAreaAndCustomer: function( emp_id, idArea, idEjecutivo ) {
            // console.log(idEjecutivo);
            return $http({
                url: Path_Ejecutivo + 'getByAreaAndCustomer/',
                method: "POST",
                params: {
                    emp_id: emp_id,
                    idArea: idArea,
                    idEjecutivo: idEjecutivo
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        getAgenteByKey: function( key ) {
            return $http({
                url: Path_Ejecutivo + 'getEjecutivoByKey/',
                method: "POST",
                params: {
                    key: key
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        getAgenteById: function( idEjecutivo ) {
            // console.log( 'idEjecutivo', idEjecutivo );
            return $http({
                url: Path_Ejecutivo + 'getEjecutivoById/',
                method: "POST",
                params: {
                    idEjecutivo: idEjecutivo
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        cambiaEstatus: function( idEje, idEstatus ) {
            return $http({
                url: Path_Ejecutivo + 'cambioEstatus/',
                method: "POST",
                params: {
                    eje_id: idEje,
                    ese_id: idEstatus
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        updateInfo: function( parametros ) {
            return $http({
                url: Path_Ejecutivo + 'updateInfo/',
                method: "POST",
                params: parametros,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        asignarArea: function( idEjecutivo, idArea, estatus ) {
            return $http({
                url: Path_Ejecutivo + 'asignarArea/',
                method: "POST",
                params: {
                    idEjecutivo:idEjecutivo,
                    idArea:idArea,
                    estatus:estatus
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        byEmpresa: function( idEmpresa ) {
            return $http({
                url: Path_Cliente + 'byEmpresa/',
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
        asignarCliente: function( idEjecutivo, idCliente, estatus ) {
            return $http({
                url: Path_Cliente + 'AsiganarEjecutivo/',
                method: "POST",
                params: {
                    idEjecutivo: idEjecutivo,
                    idCliente: idCliente,
                    Estatus: estatus
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        catalogoTipoCliente: function() {
            return $http({
                url: Path_Cliente + 'catalogoTipoCliente/',
                method: "POST",
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        nuevoEjecutivo: function(emp_id, email, telefono, celular, nombre) {
            return $http({
                url: Path_Ejecutivo + 'nuevoEjecutivo/',
                method: "POST",
                params: {
                    eje_nombre: nombre,
                    eje_telefono: telefono,
                    eje_celular: celular,
                    eje_email: email,
                    emp_id: emp_id
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        sendEmail: function(email, nombre, password) {
            return $http({
                url: Path_Correos + 'SendMail/',
                method: "POST",
                params: {
                    ToEmail:  email,
                    ToName:   nombre,
                    Subject:  'Bienvenido a nuestra plataforma',
                    template: 'eje.wellcome',
                    password: password
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});