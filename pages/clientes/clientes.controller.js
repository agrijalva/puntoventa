app.controller("ClientesCtrl", ["$scope", "$location","clienteFactory", "agenteFactory", "empresaFactory","filterFilter", function($scope, $location, clienteFactory, agenteFactory, empresaFactory, filterFilter) {
    $scope.DataUser     = JSON.parse( localStorage.getItem("Data_User") );
    $scope.TotalEje     = 0;
    $scope.eje_mensaje  = 'Debes seleccionar al menos un área para asesoria.';
    $scope.GET          = $location.$$search;
    $scope.cliente = {
        razon: '',
        rfc: '',
        email: '',
        telefono: '',
        celular: '',
        nombre: '',
        tipo: '',
        eje_id: 0
    }

    $scope.Init = function(){
        $scope.getByEmpresa();
    }

    $scope.Init_Nuevo = function(){
        $scope.getCTC();
        $scope.getAreas( 0 );
        $(".razon_social").focus();
    }

    $scope.Init_Detalle = function(){
        $scope.getCTC();
        $(".razon_social").focus();
        $scope.getCliente( $scope.GET['key'] );
    }

    $scope.getCliente = function( key ){
        clienteFactory.getCliente( key ) .then(function(result){
            $scope.ClienteOne = result.data;
            if( $scope.ClienteOne.success ){
                console.log( $scope.ClienteOne );
                $scope.cliente = {
                    cli_id: $scope.ClienteOne.data[0].cli_id,
                    razon: $scope.ClienteOne.data[0].cli_rason_social,
                    rfc: $scope.ClienteOne.data[0].cli_rfc,
                    email: $scope.ClienteOne.data[0].cli_email,
                    telefono: $scope.ClienteOne.data[0].cli_telefono,
                    celular: $scope.ClienteOne.data[0].cli_celular,
                    nombre: $scope.ClienteOne.data[0].cli_nombre,
                    tipo: $scope.ClienteOne.data[0].ctc_id,
                    estatus: $scope.ClienteOne.data[0].cli_estatus,
                    eje_id: $scope.ClienteOne.data[0].eje_id
                }

                $scope.getAreas( $scope.ClienteOne.data[0].cli_id );
                agenteFactory.getAgenteById( $scope.ClienteOne.data[0].eje_id ).then(function(result){});
            }
            else{
                // location.href = "#/admin/clientes";
            }
        }, function(error){
            swal("Clientes", "Ocurrio un error: " + error);
        }); 
    }

    $scope.getByEmpresa = function(){
        clienteFactory.getByEmpresa( $scope.DataUser.emp_id ) .then(function(result){
            var Resultado = result.data;
            $scope.Clientes = Resultado.data;
        }, function(error){
            swal("Clientes", "Ocurrio un error: " + error);
        }); 
    }

    $scope.getCTC = function(){
        agenteFactory.catalogoTipoCliente().then(function(result){
            $scope.ctc = result.data.data;
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.SaveCliente = function(){
        if( $scope.cliente.eje_id == 0 ){
            swal({
                title: "Ejecutivo no asignado",
                text: "No se ha seleccionado al ejecutivo que se encargará de este cliente, si no asigna ahora, posteriormente podra asignarselo. <br><br>¿Desea guardarlo sin ejecutivo?",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Guardar",
                cancelButtonText: "No",
                closeOnConfirm: false,
                html: true
            },
            function(){
                $scope.nuevoCliente();
            });
        }else{
            $scope.nuevoCliente();
        }
    }

    $scope.nuevoCliente = function(){
        var parametros = {
            emp_id:  $scope.DataUser.emp_id,
            cli_razon_social:     $scope.cliente.razon,
            cli_rfc:       $scope.cliente.rfc,
            cli_email:     $scope.cliente.email,
            cli_telefono:  $scope.cliente.telefono,
            cli_nombre:    $scope.cliente.nombre,
            ctc_id:       $scope.cliente.tipo
        }

        clienteFactory.nuevoCliente( parametros ).then(function(result){
            $scope.Nuevo = result.data;

            if( $scope.Nuevo.success == true || $scope.Nuevo.success == "1" ){
                $scope.Areas.data.forEach( function( item, key ){
                    clienteFactory.asignarArea( $scope.Nuevo.LastId, item.ca_id, (item.checked) ? 1 : 2 );
                });

                agenteFactory.asignarCliente( $scope.cliente.eje_id, $scope.Nuevo.LastId, 1 );
                clienteFactory.sendEmail(parametros.cli_email, parametros.cli_nombre, $scope.Nuevo.pass);

                swal({
                    title: "Cliente",
                    text: $scope.Nuevo.msg,
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                },
                function(){
                    location.href = '#/admin/clientes';
                });
            }
            else{
                swal("Cliente", $scope.Nuevo.msg);
            }
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.actualizaCliente = function(){
        var parametros = {
            cli_id:  $scope.cliente.cli_id,
            cli_razon_social:     $scope.cliente.razon,
            cli_rfc:       $scope.cliente.rfc,
            cli_telefono:  $scope.cliente.telefono,
            cli_celular:   $scope.cliente.celular,
            cli_nombre:    $scope.cliente.nombre,
            ctc_id:       $scope.cliente.tipo
        }

        clienteFactory.actualizaCliente( parametros ).then(function(result){
            $scope.Nuevo = result.data;

            if( $scope.Nuevo.success == true || $scope.Nuevo.success == "1" ){
                $scope.Areas.data.forEach( function( item, key ){
                    clienteFactory.asignarArea( $scope.cliente.cli_id, item.ca_id, (item.checked) ? 1 : 2 );
                });
                agenteFactory.asignarCliente( $scope.cliente.eje_id, $scope.cliente.cli_id, 1 );

                swal({
                    title: "Cliente",
                    text: $scope.Nuevo.msg,
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                },
                function(){
                    location.href = '#/admin/clientes';
                });
            }
            else{
                swal("Cliente", $scope.Nuevo.msg);
            }
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.goDetalle = function( key ){
        location.href = "#/admin/cliente_detalle?key=" + key ;
    }

    $scope.getAreas = function( cli_id ){
        empresaFactory.getAreas( $scope.DataUser.emp_id, cli_id ).then(function(result){
            $scope.Areas = result.data;

            $scope.Areas.data.forEach( function( item, key ){
                if( cli_id == 0 ){
                    $scope.Areas.data[ key ].checked = false;
                }
                else{
                    if( parseInt(item.checked) == 0 ){
                        $scope.Areas.data[ key ].checked = false;
                    }
                    else{
                        $scope.Areas.data[ key ].checked = true;
                    }

                    if( key == ($scope.Areas.data.length - 1) ){
                        $scope.GetEjecutivosByCliente();
                    }
                }
            });
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.GetEjecutivos = function(){
        $scope.ArSel = filterFilter( $scope.Areas.data , {checked: true} );

        var seleccionados = [];
        $scope.ArSel.forEach( function( item, key ){
            seleccionados.push( item.ca_id );
        });

        var sAreas = seleccionados.join(',');
        $scope.TotalEje = $scope.ArSel.length;

        agenteFactory.getByArea( $scope.DataUser.emp_id, sAreas ).then(function(result){
            $scope.Ejecutivos = result.data;
            if( !$scope.Ejecutivos.success ){
                $scope.TotalEje = 0;
                if( $scope.ArSel.length == 0 ){
                    $scope.eje_mensaje  = 'Debes seleccionar al menos un área para asesoria.';
                }
                else{
                    $scope.eje_mensaje = 'No hay ejecutivos para el área seleccionada.';
                }
            }
            else{
                $scope.TotalEje = 1;
            }
        }, function(error){
            console.log("Error", error);
        });

        // Se guarda la asignación del area en cuestion
        $scope.Areas.data.forEach( function( item, key ){
            clienteFactory.asignarArea( $scope.cliente.cli_id, item.ca_id, (item.checked) ? 1 : 2 );
        });
    }

    $scope.GetEjecutivosByCliente = function(  ){
        $scope.ArSel = filterFilter( $scope.Areas.data , {checked: true} );
        $scope.ClienteOne.data[0].eje_id = $scope.ClienteOne.data[0].eje_id === undefined ? 0 : $scope.ClienteOne.data[0].eje_id;

        var seleccionados = [];
        $scope.ArSel.forEach( function( item, key ){
            seleccionados.push( item.ca_id );
        });

        var sAreas = seleccionados.join(',');
        $scope.TotalEje = $scope.ArSel.length;
        agenteFactory.getByAreaAndCustomer( $scope.DataUser.emp_id, sAreas,$scope.ClienteOne.data[0].eje_id ).then(function(result){
            $scope.Ejecutivos = result.data;
            if( !$scope.Ejecutivos.success ){
                $scope.TotalEje = 0;
                if( $scope.ArSel.length == 0 ){
                    $scope.eje_mensaje  = 'Debes seleccionar al menos un área para asesoria.';
                }
                else{
                    $scope.eje_mensaje = 'No hay ejecutivos para el área seleccionada.';
                }
            }
            else{
                $scope.TotalEje = 1;
            }
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.openInfoEdit = function(){
        $scope.clienteEdit = { 
            razon: $scope.cliente.razon,
            rfc: $scope.cliente.rfc
        }
        $('#modal_info').modal('show');
    }

    $scope.saveInfoEdit = function(){
        clienteFactory.UpdateCliente( $scope.cliente.cli_id, $scope.clienteEdit.razon, $scope.clienteEdit.rfc ).then(function(result){
            $scope.data = result.data;
            swal('Planeta Fiscal', $scope.data.msg);

            $scope.cliente.razon = $scope.clienteEdit.razon;
            $scope.cliente.rfc = $scope.clienteEdit.rfc;
            
        }, function(error){
            console.log("Error", error);
        });

        $('#modal_info').modal('hide');
    }

    $scope.openAsignArea = function(){
        $scope.areasCliente = $scope.Areas.data;

        $scope.areasCliente.forEach( function( item, key ){
            clienteFactory.usoArea( $scope.cliente.cli_id, item.ca_id ).then(function(result){
                item.enabled = result.data.success;
                item.mensaje  = !item.enabled ? '<span class="label label-warning">Existen agentes con esta área asignada</span>' : '';
            }, function(error){
                item.enabled = true;
            });
        });

        $('#modal_areas').modal('show');
    }

    $scope.openAsignContactos = function(){
        $scope.contacto = {
            nombre: '',
            email: '',
            telefono: ''
        }
        $('#modal_contactos').modal('show');
    }

    $scope.nuevoResponsable = function(){
        var parametros = {
            cli_id:  $scope.cliente.cli_id,
            emp_id:  $scope.DataUser.emp_id,
            rep_email:     $scope.contacto.email,
            rep_telefono:  $scope.contacto.telefono,
            rep_nombre:    $scope.contacto.nombre
        }

        clienteFactory.nuevoResponsable( parametros ).then(function(result){
            $scope.Nuevo = result.data;

            if( $scope.Nuevo.success == true || $scope.Nuevo.success == "1" ){
                clienteFactory.sendEmail(parametros.cli_email, parametros.cli_nombre, $scope.Nuevo.pass);

                swal({
                    title: "Cliente",
                    text: $scope.Nuevo.msg,
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                },
                function(){
                    $('#modal_contactos').modal('hide');
                    $scope.getCliente( $scope.GET['key'] );
                });
            }
            else{
                swal("Cliente", $scope.Nuevo.msg);
            }
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.openEditResponsable = function( indice ){
        var rep = $scope.ClienteOne.data[0].Representantes[indice];
        $scope.contacto = {
            indice: indice,
            id: rep.rep_id,
            nombre: rep.rep_nombre,
            email: rep.rep_email,
            telefono: rep.rep_telefono
        }

        $('#modal_edit_responsable').modal('show');
    }

    $scope.actualizarResponsable = function(){
        var parametros = {
            rep_id:        $scope.contacto.id,
            rep_email:     $scope.contacto.email,
            rep_telefono:  $scope.contacto.telefono,
            rep_nombre:    $scope.contacto.nombre
        }

        clienteFactory.actualizarResponsable( parametros ).then(function(result){
            $scope.Editado = result.data;
            if( $scope.Editado.success == true || $scope.Editado.success == "1" ){

                swal({
                    title: "Cliente",
                    text: $scope.Editado.msg,
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                },
                function(){
                    $scope.ClienteOne.data[0].Representantes[ $scope.contacto.indice ].rep_nombre    = $scope.contacto.nombre;
                    $scope.ClienteOne.data[0].Representantes[ $scope.contacto.indice ].rep_telefono  = $scope.contacto.telefono;
                    $scope.$apply();
                    $('#modal_edit_responsable').modal('hide');
                });
            }
            else{
                swal("Cliente", $scope.Editado.msg);
            }
        }, function(error){
            console.log("Error", error);
        });
    }  

    $scope.eliminarResponsable = function( indice ){
        swal({
            title: "¿Estas seguro?",
            text: "Esta a punto de eliminar a un responsable, al aceptar los registros quedaran como historico.",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Aceptar",
            cancelButtonText: "No",
            closeOnConfirm: false
        },
        function(){
            var rep = $scope.ClienteOne.data[0].Representantes[indice];
            clienteFactory.eliminarResponsable( rep.rep_id ).then(function(result){
                $scope.ClienteOne.data[0].Representantes.splice( indice, 1 );
                swal("Planeta Fiscal", "Se ha eliminado correctamente este contacto", "success");
            }, function(error){
                console.log("Error", error);
            });
        });
    }

    $scope.actividadCliente = function(){
        var inactivar = 'Al deshabilitar este cliente ya no tendra accesos a las herramientas, esta operación es reversible.';
        var activar = 'Al habilitar este cliente nuevamente podra acceder a la herramienta.';

        swal({
            title: "¿Estas seguro?",
            text: ( $scope.cliente.estatus == 1 ) ? inactivar : activar,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Aceptar",
            cancelButtonText: "No",
            closeOnConfirm: false
        },
        function(){
            clienteFactory.controlActividadCliente( $scope.cliente.cli_id ).then(function(result){
                $scope.getCliente( $scope.GET['key'] );
                swal("Planeta Fiscal", result.data.msg, "success");
            }, function(error){
                console.log("Error", error);
            });
        });
    }

    $scope.openModalEjecutivo = function(){
        $scope.ejecutivo = {agregar: 0};
        agenteFactory.getAgentes( $scope.DataUser.emp_id, 0 ) .then(function(result){
            if( result.data.success ){
                $scope.agentesAsignar = [];
                var areasActivasCliente = filterFilter( $scope.Areas.data, { checked: true } );

                result.data.data.forEach( function( item, key ){
                    var Existen = filterFilter( $scope.ClienteOne.data[0].Ejecutivos, { eje_id: item.eje_id } );
                    if( Existen.length == 0 ){
                        var areasActivas = filterFilter( item.Areas, { ejar_estatus: 1 } );

                        var activarAgente = 0;
                        areasActivasCliente.forEach( function(i, k){
                            var conincidenciasAreas = filterFilter(areasActivas, { ca_id: i.ca_id })
                            if( conincidenciasAreas.length != 0 )
                                activarAgente++;
                        });

                        if( activarAgente != 0 ){
                            $scope.agentesAsignar.push( item );
                        }
                    }
                });
                $('#modal_agentes').modal('show');
            }
            else{
                swal("Planeta Fiscal", "Imposible realizar esta acción, no se encontraron agentes", "warning");
            }
        });   
    }

    $scope.getAjentesPorCliente = function(){
        $scope.ejecutivo = {agregar: 0};
        agenteFactory.getAgentes( $scope.DataUser.emp_id, 0 ) .then(function(result){
            if( result.data.success ){
                $scope.agentesAsignar = [];
                var areasActivasCliente = filterFilter( $scope.Areas.data, { checked: true } );

                result.data.data.forEach( function( item, key ){
                    var Existen = filterFilter( $scope.ClienteOne.data[0].Ejecutivos, { eje_id: item.eje_id } );
                    if( Existen.length == 0 ){
                        var areasActivas = filterFilter( item.Areas, { ejar_estatus: 1 } );

                        var activarAgente = 0;
                        areasActivasCliente.forEach( function(i, k){
                            var conincidenciasAreas = filterFilter(areasActivas, { ca_id: i.ca_id })
                            if( conincidenciasAreas.length != 0 )
                                activarAgente++;
                        });

                        if( activarAgente != 0 ){
                            $scope.agentesAsignar.push( item );
                        }
                    }
                });
            }
            else{
                swal("Planeta Fiscal", "Imposible realizar esta acción, no se encontraron agentes", "warning");
            }
        });
    }

    $scope.asignarAreaCliente = function(){
        clienteFactory.asignaAgente( $scope.cliente.cli_id, $scope.ejecutivo.agregar.eje_id ) .then(function(result){
            if( result.data.success ){
                $scope.getCliente( $scope.GET['key'] );
                $scope.agentesAsignar = []; 
                swal({
                    title: "Planeta Fiscal",
                    text: result.data.msg,
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                },
                function(){
                    $scope.getAjentesPorCliente();
                });
            }
            else{
                swal("Planeta Fiscal", "Imposible realizar esta acción, no se encontraron agentes", "warning");
            }
        }); 
    }

    $scope.quitarAgente = function( clej_id ){
        swal({
            title: "Quitar agente",
            text: "¿Esta seguro de quitar este agente?",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            closeOnConfirm: false
        },
        function(){
            clienteFactory.quitarAgente( clej_id ).then(function(result){
                $scope.getCliente( $scope.GET['key'] );
                $scope.agentesAsignar = []; 
                $scope.getAjentesPorCliente();
                swal("Planeta Fiscal", result.data.msg, "success");
            }, function(error){
                console.log("Error", error);
            });
        });
    }

    $scope.setAgentePrincipal = function( clej_id ){
        swal({
            title: "Agente principal",
            text: "¿Esta seguro de que este agente sera el principal?",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            closeOnConfirm: false
        },
        function(){
            clienteFactory.setAgentePrincipal( clej_id ).then(function(result){
                $scope.getCliente( $scope.GET['key'] );
                $scope.agentesAsignar = [];
                $scope.getAjentesPorCliente();
                swal("Planeta Fiscal", result.data.msg, "success");
            }, function(error){
                console.log("Error", error);
            });
        });
    }

    $scope.goDetalleEjecutivo = function( key ){
        location.href = "#/admin/agente_detalle?key=" + key ;
    }
}]);