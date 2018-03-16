var DashTemplates = 'pages/dashboard/templates/';

app.directive('resumenTotales', function() {
    return {
        templateUrl: DashTemplates + 'resumenTotales.html'
    };
})
app.directive('resumenVentas', function() {
    return {
        templateUrl: DashTemplates + 'resumenVentas.html'
    };
})
app.directive('resumenGastos', function() {
    return {
        templateUrl: DashTemplates + 'resumenGastos.html'
    };
})
app.directive('resumenEntradas', function() {
    return {
        templateUrl: DashTemplates + 'resumenEntradas.html'
    };
})
app.directive('resumenTraspasos', function() {
    return {
        templateUrl: DashTemplates + 'resumenTraspasos.html'
    };
})
app.directive('resumenMezclas', function() {
    return {
        templateUrl: DashTemplates + 'resumenMezclas.html'
    };
})


app.directive('ventaNotas', function() {
    return {
        templateUrl: DashTemplates + 'ventaNotas.html'
    };
})
app.directive('ventaProductosVendidos', function() {
    return {
        templateUrl: DashTemplates + 'ventaProductosVendidos.html'
    };
})


app.directive('gastosNotas', function() {
    return {
        templateUrl: DashTemplates + 'gastosNotas.html'
    };
})
app.directive('gastosRubro', function() {
    return {
        templateUrl: DashTemplates + 'gastosRubro.html'
    };
})


app.directive('entradasNotas', function() {
    return {
        templateUrl: DashTemplates + 'entradasNotas.html'
    };
})
app.directive('entradasProductosIngresados', function() {
    return {
        templateUrl: DashTemplates + 'entradasProductosIngresados.html'
    };
})


app.directive('traspasosNotas', function() {
    return {
        templateUrl: DashTemplates + 'traspasosNotas.html'
    };
})
app.directive('traspasosEntradasSalidas', function() {
    return {
        templateUrl: DashTemplates + 'traspasosEntradasSalidas.html'
    };
})


app.directive('mezclasNotas', function() {
    return {
        templateUrl: DashTemplates + 'mezclasNotas.html'
    };
})
app.directive('mezclasComportamiento', function() {
    return {
        templateUrl: DashTemplates + 'mezclasComportamiento.html'
    };
})


app.directive('menuListas', function() {
    return {
        template: `<ul class="nav">
                        <li> 
                            <a href="" ng-click="controlPanel('ventas','notas');"> 
                                <table border="0" width="100%">
                                    <tr>
                                        <td width="25"> <i class="fa fa-money text-red"></i> </td>
                                        <td> VENTAS </td>
                                    </tr>
                                </table>
                            </a> 
                        </li>
                        <li> 
                            <a href="" ng-click="controlPanel('gastos','notas');"> 
                                <table border="0" width="100%">
                                    <tr>
                                        <td width="25"> <i class="fa fa-money text-orange"></i> </td>
                                        <td> GASTOS </td>
                                    </tr>
                                </table>
                            </a> 
                        </li>
                        <li> 
                            <a href="" ng-click="controlPanel('entradas','notas');">
                                <table border="0" width="100%">
                                    <tr>
                                        <td width="25"> <i class="fa fa-level-down text-orange"></i> </td>
                                        <td> ENTRADAS </td>
                                    </tr>
                                </table>
                            </a> 
                        </li>
                        <li> 
                            <a href="" ng-click="controlPanel('traspasos','notas');"> 
                                <table border="0" width="100%">
                                    <tr>
                                        <td width="25"> <i class="fa fa-retweet text-sky-blue"></i> </td>
                                        <td> TRASPASOS </td>
                                    </tr>
                                </table>
                            </a> 
                        </li>
                        <li> 
                            <a href="" ng-click="controlPanel('mezclas','notas');"> 
                                <table border="0" width="100%">
                                    <tr>
                                        <td width="25"> <i class="fa fa-filter text-green"></i> </td>
                                        <td> MEZCLAS </td>
                                    </tr>
                                </table>
                            </a> 
                        </li>
                    </ul>`
    };
})

