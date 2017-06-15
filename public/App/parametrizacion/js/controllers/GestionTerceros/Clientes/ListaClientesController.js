define(["angular", 
    "js/controllers",
    'includes/slide/slideContent',
    "controllers/GestionTerceros/Clientes/GuardarClienteController"], function(angular, controllers) {

    controllers.controller('ListaClientesController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        function($scope, $rootScope, Request,
                 API, socket, AlertService, 
                 $state, Usuario, localStorageService, $modal) {
                     
            var self = this;
            
            $scope.root = {};
            var self = this;

            $scope.listaClientes = {
                data: 'usuarios',
                multiSelect: false,
                showFilter: true,
                enableRowSelection: true,
                columnDefs: [
                    {field: 'nombre_usuario', displayName: 'Nombre'},
                    {field: 'usuario', displayName: 'Identificación'},
                    {field: 'usuario', displayName: 'Dirección'}
                ]

            };
            
            $scope.onIrVistaGuardarCliente = function(){
                $state.go("GuardarCliente");
            };

        }]);
        
});
