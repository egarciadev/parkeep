define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('HomeController', ['$scope', 'Usuario', "Request", "localStorageService","$modal",
        function($scope, Usuario, Request, localStorageService, $modal) {
            
            
            var mensaje = localStorageService.get("mensajeDashboard");
            
            if(mensaje){
                $scope.opts = {
                    backdrop: true,
                    backdropClick: false,
                    dialogFade: false,
                  //  size: 'sm',
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Aviso</h4>\
                                </div>\
                                <div class="modal-body">\
                                    <h5 >{{mensaje.mensaje}}</h5>\
                                </div>\
                                <div class="modal-footer">\
                                    <button class="btn btn-primary" ng-click="close()">Ok</button>\
                                </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance, mensaje) {
                        $scope.mensaje = mensaje;
                        $scope.close = function() {
                            console.log("on close dashboard");
                            localStorageService.set("mensajeDashboard", undefined);
                            $modalInstance.close();
                        };

                    },
                    resolve: {
                        mensaje: function() {
                            return mensaje;
                        }
                    }
                };
                var modalInstance = $modal.open($scope.opts);
                
            }

            $scope.Usuario = Usuario.getUsuarioActual();

            $scope.exampleData = [{
                    key: "Enero",
                    y: 129
                }, {
                    key: "Febrero",
                    y: 200
                }, {
                    key: "Marzo",
                    y: 150
                }, {
                    key: "Abril",
                    y: 80
                }, {
                    key: "Mayo",
                    y: 200
                }, {
                    key: "Junio",
                    y: 120
                }, {
                    key: "Julio",
                    y: 150
                },
                {
                    key: "Agosto",
                    y: 80
                },
                {
                    key: "Septiembre",
                    y: 90
                },
                {
                    key: "Octubre",
                    y: 100
                },
                {
                    key: "Noviembre",
                    y: 120
                },
                {
                    key: "Diciembre",
                    y: 110
                }
            ];


            $scope.xFunction = function() {
                return function(d) {
                    return d.key;
                };
            };

            $scope.yFunction = function() {
                return function(d) {
                    return d.y;
                };
            };

            $scope.descriptionFunction = function() {
                return function(d) {
                    return d.key;
                };
            };



            $scope.exampleData2 = [
                {
                    key: "Despachos Generados",
                    values: [
                        ["Enero", 129],
                        ["Febrero", 200],
                        ["Marzo", 150],
                        ["Abril", 80],
                        ["Mayo", 130],
                        ["Junio", 200],
                        ["Julio", 210],
                        ["Agosto", 200],
                        ["Septiembre", 180],
                        ["Octubre", 100],
                        ["Noviembre", 170],
                        ["Diciembre", 250]
                    ]
                }
            ];

            $scope.toolTipContentFunction = function() {
                return function(key, x, y, e, graph) {
                    return  '<h4>' + key + '</h4>' +
                            '<p>' + y + ' en ' + x + '</p>';
                };
            };

            $scope.toolTipContentFunction2 = function() {
                return function(key, x, y, e, graph) {
                    return  '<center><h4>' + key + '</h4></center>' +
                            '<p>' + x + '</p>';
                };
            };

        }]);
});
