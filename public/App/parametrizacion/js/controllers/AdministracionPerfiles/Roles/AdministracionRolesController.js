
define(["angular", "js/controllers", "js/models",
    "controllers/AdministracionModulos/Modulos/OpcionesModulosController",
    "includes/classes/Rol", "models/Perfiles/RolModulo"
], function(angular, controllers) {

    controllers.controller('AdministracionRolesController', [
        '$scope', '$rootScope', 'Request', '$modal', 'API',
        "socket", "$timeout", "AlertService", "Usuario", "EmpresaParametrizacion",
        "Empresa_Modulo", "Modulo", "Rol", "RolModulo", "localStorageService","$state",
        "ParametrizacionService",
        function($scope, $rootScope, Request,
                $modal, API, socket, $timeout,
                AlertService, Usuario, EmpresaParametrizacion,
                Empresa_Modulo, Modulo, Rol, RolModulo, localStorageService, $state,
                ParametrizacionService) {

            var self = this;


            $scope.rootRoles = {
            };

            $scope.rootModulos = {
            };

            $scope.rootRoles.empresas = [];

            $scope.rootRoles.modulos_empresa = [];

            $scope.rootModulos.session = {
                 usuario_id: Usuario.getUsuarioActual().getId(),
                 auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.rootModulos.modulosPreseleccionados = [];

            self.inicializarRolACrear = function() {
                $scope.rootModulos.moduloAGuardar = Modulo.get();
                $scope.rootRoles.rolAGuardar = Rol.get();
            };


            self.validarCreacionRol = function() {
                var rol = $scope.rootRoles.rolAGuardar;
                var validacion = {
                    valido: true,
                    msj: ""
                };


                if (rol.nombre === undefined || rol.nombre.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "El rol debe tener un nombre";
                    return validacion;
                }

                if (rol.observacion === undefined || rol.observacion.length === 0) {
                    validacion.valido = false;
                    validacion.msj = "El rol debe tener una observacion";
                    return validacion;
                }

                if ($scope.rootRoles.empresaSeleccionada === undefined || $scope.rootRoles.empresaSeleccionada.getCodigo().length === 0) {
                    validacion.valido = false;
                    validacion.msj = "Debe seleccionar una empresa";
                    return validacion;
                }

                return validacion;

            };


            self.traerEmpresas = function() {
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                    }
                };

                Request.realizarRequest(API.MODULOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    if (data.status === 200) {
                        $scope.rootRoles.empresas = [];
                        var datos = data.obj.empresas;

                        for (var i in datos) {

                            var empresa = EmpresaParametrizacion.get(
                                    datos[i].razon_social,
                                    datos[i].empresa_id
                            );

                            $scope.rootRoles.empresas.push(empresa);

                            //se verifica cual es la empresa a la que pertenece el rol
                            if ($scope.rootRoles.rolAGuardar.getId() > 0) {
                                if ($scope.rootRoles.rolAGuardar.getEmpresaId() === empresa.getCodigo()) {
                                    $scope.rootRoles.empresaSeleccionada = empresa;
                                    $scope.onEmpresaSeleccionada();
                                }
                            }

                        }

                    }

                });
            };


            self.traerRolPorId = function(rol_id, callback) {
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_perfiles: {
                            roles: [rol_id]
                        }
                    }
                };

                Request.realizarRequest(API.PERFILES.OBTENER_ROLES_POR_ID, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var roles = data.obj.parametrizacion_perfiles.roles;

                        if (roles.length > 0) {
                            var rol = roles[0];
                            $scope.rootRoles.rolAGuardar = Rol.get(
                                    rol.id,
                                    rol.nombre,
                                    rol.observacion,
                                    rol.empresa_id
                            );
                            $scope.rootRoles.rolAGuardar.setEstado(rol.estado);
                        }

                        callback();
                    }

                });
            };


            $scope.listado_opciones = {
                data: 'rootRoles.moduloAGuardar.opciones',
                enableColumnResize: true,
                enableRowSelection: false,
                showFilter: true,
                columnDefs: [
                    {field: 'nombre', displayName: 'Nombre'},
                    {field: 'alias', displayName: 'Alias'},
                    {field: 'accion', displayName: '', width: '70',
                        cellTemplate: '<div class="ngCellText txt-center">\
                                      <button class="btn btn-default btn-xs" ng-click="onEditarOpcion(row.entity)"><span class="glyphicon glyphicon-zoom-in"></span></button>\
                                      <button class="btn btn-default btn-xs" ng-click="onBorrarOpcion(row.entity)"><span class="glyphicon glyphicon-remove"></span></button>\
                                   </div>'
                    }
                ]

            };
            
           self.traerModulosPorRol = function(callback) {

                var parametros = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_perfiles: {
                            rol_id: $scope.rootRoles.rolAGuardar.getId()
                        }
                    }
                };
                
                ParametrizacionService.traerModulosPorRol(parametros, $scope.rootRoles.rolAGuardar, function(success){
                    if(success){
                        
                        callback();
                    }
                });

            };

            //trae todos los modulos que estan disponibles para la empresa seleccionada
            $scope.onEmpresaSeleccionada = function() {
                //se evita que traiga los modulos si no se a guardado el rol
                if ($scope.rootRoles.rolAGuardar.getId() === 0) {  
                    return;
                }

                var parametros = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_roles: {
                            empresa_id: $scope.rootRoles.empresaSeleccionada.getCodigo()
                        }
                    }
                };
                
                ParametrizacionService.traerModulos(parametros, $scope.rootRoles.empresaSeleccionada, self.esModuloSeleccionado);
                //$scope.rootRoles.modulos_empresa = angular.copy($scope.rootRoles.empresaSeleccionada.getListaEmpresas());
                //$scope.rootRoles.empresaSeleccionada.vaciarListaEmpresas();
                
            };
            
            $rootScope.$on("datosArbolCambiados",function(e, modulos){
                $scope.$broadcast("datosArbolCambiados", modulos);
            });

            //se busca en el rol los modulo que le pertenecen
            self.esModuloSeleccionado = function(modulo) {
                var modulos =  $scope.rootRoles.rolAGuardar.getModulos();
                //console.log("modulos del rol ",modulos);
                for (var i in modulos) {
                    //console.log("buscando en ",modulos[i].getModulo().getId(), " buscando con  ",modulo.getId(), " estado ",modulos[i].getModulo().getEstado())
                    if (modulos[i].getModulo().getId() === modulo.getId() && modulos[i].getModulo().getEstado()) {
                        return modulos[i];
                    }
                }
                return null;
            };
            
            
            self.obtenerModuloSeleccionado = function(modulo_id) {
                
                return ParametrizacionService.obtenerModuloSeleccionado(modulo_id, $scope.rootRoles.empresaSeleccionada);
                
            };
            
            //agrega modulo al rol actual buscandolo en los modulos seleccionados para la empresa por el id, se retorna el modulo que se guardo
            self.agregarModulo = function(modulo_id, estado) {
                
                return ParametrizacionService.agregarModulo($scope.rootRoles.rolAGuardar, $scope.rootRoles.empresaSeleccionada, modulo_id, estado);

            };

            //basado en los modulos seleccionados, se envian para ser habilitardos para el rol
            self.habilitarModulosRol = function() {

                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_perfiles: {
                            rolesModulos: $scope.rootRoles.rolAGuardar.getModulos()
                        }
                    }
                };

                Request.realizarRequest(API.PERFILES.HABILITAR_MODULOS_ROLES, "POST", obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", "El modulo se habilito en el rol correctamente");
                        var rol = $scope.rootRoles.rolAGuardar;
                        var ids = data.obj.parametrizacion_perfiles.ids;
                        
                        //se asigna el id del rol_modulo guardado, ya sea que se modifique o cree
                        var modulos = rol.getModulos();
                        for(var i in ids){
                            
                            for(var ii in modulos){
                                if(modulos[ii].getModulo().getId() === ids[i].modulo_id){
                                    modulos[ii].setId(ids[i].roles_modulos_id);
                                    break;
                                }
                            }
                          
                        }
                        

                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });
            };
            
            
            //trae las opciones del modulo asignadas para el rol
            self.listarRolesModulosOpciones = function(modulo){
                var modulo = self.agregarModulo(modulo, true);

                if (!modulo) {
                    return;
                }
                
                $scope.rootModulos.moduloAGuardar = modulo.getModulo();
                $scope.rootModulos.moduloAGuardar.vaciarRoles();
                
                var rolModulo = self.esModuloSeleccionado(modulo.getModulo());
                
                $scope.rootModulos.moduloAGuardar.agregarRol(rolModulo);
                var rol_modulo_id = rolModulo.getId();
                var rol_id = $scope.rootRoles.rolAGuardar.getId();
                var empresa_id = $scope.rootRoles.rolAGuardar.getEmpresaId();
                
                $scope.rootModulos.moduloAGuardar.vaciarOpciones();
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_perfiles: {
                            modulo: {
                                id: $scope.rootModulos.moduloAGuardar.modulo_id,
                                rol_modulo_id:rol_modulo_id,
                                rol_id:rol_id,
                                empresa_id:empresa_id
                            }
                        }
                    }
                };

                Request.realizarRequest(API.PERFILES.LISTAR_ROLES_MODULOS_OPCIONES, "POST", obj, function(data) {
                    if (data.status === 200) {
                        var datos = data.obj.parametrizacion_perfiles.opciones_modulo;
                        
                        //se emite el evento con los datos al controllador de opciones
                        $scope.$broadcast("traerOpcionesModulo", datos);

                    }

                });
            };

            $scope.$on("modulosSeleccionados", function(e, modulos_seleccionado) {
                //vacia los modulos del rol para enviar solo los seleccionados en el momento
                $scope.rootRoles.rolAGuardar.vaciarModulos();  
                
                var modulo = self.agregarModulo(modulos_seleccionado.seleccionado, true);

                if (!modulo) {
                    return;
                }
                
                $scope.rootModulos.moduloAGuardar = modulo.getModulo();


                for (var i in modulos_seleccionado.padres) {
                    self.agregarModulo(modulos_seleccionado.padres[i], true);
                }

                for (var ii in modulos_seleccionado.hijos) {
                    self.agregarModulo(modulos_seleccionado.hijos[ii], true);
                }
                
                self.habilitarModulosRol();
                
                //console.log("modulos seleccionados >>>>>>>>>>>>>>>>>>", $scope.rootRoles.rolAGuardar.getModulos());
            });
            
            $rootScope.$on("onseleccionarnodo", function(e, modulo){
               $scope.$broadcast("onseleccionarnodo",modulo.id); 
            });
            
            
            $rootScope.$on("onSeleccionarOpcion", function(event, opcion){
                $scope.rootModulos.moduloAGuardar.opcionAGuardar  = opcion;
                
                if(!opcion.estado){
                    return;
                }
                
                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_perfiles: {
                            modulo: $scope.rootModulos.moduloAGuardar
                        }
                    }
                };

                Request.realizarRequest(API.PERFILES.GUARDAR_OPCION, "POST", obj, function(data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("success", "Opcion guardada correctamente");

                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });
            });

            $scope.$on("traerOpcioesModuloSeleccionado", function(e, modulo_id) {
                self.listarRolesModulosOpciones(modulo_id);
            });

            $scope.$on("modulosDeshabilitados", function(e, modulos_seleccionados) {
                //console.log("modulos a deshabilitar ", modulos_seleccionados);

                $scope.rootRoles.rolAGuardar.vaciarModulos();
                var modulo = self.agregarModulo(modulos_seleccionados.seleccionado, false);

                if (!modulo) {
                    return;
                }

                $scope.rootModulos.moduloAGuardar = modulo.getModulo();

                for (var ii in modulos_seleccionados.hijos) {
                    self.agregarModulo(modulos_seleccionados.hijos[ii], false);
                }

                self.habilitarModulosRol();
            });

            $scope.onGuardarRol = function() {

                var validacion = self.validarCreacionRol();

                if (!validacion.valido) {
                    AlertService.mostrarMensaje("warning", validacion.msj);
                    return;
                }

                $scope.rootRoles.rolAGuardar.setEmpresaId($scope.rootRoles.empresaSeleccionada.getCodigo());
                var rol_guardar = angular.copy($scope.rootRoles.rolAGuardar);

                //console.log("rol a guardar ", rol_guardar);

                var obj = {
                    session: $scope.rootModulos.session,
                    data: {
                        parametrizacion_perfiles: {
                            rol: rol_guardar
                        }
                    }
                };

                Request.realizarRequest(API.PERFILES.GUARDAR_ROL, "POST", obj, function(data) {
                    if (data.status === 200) {

                        var id = data.obj.parametrizacion_perfiles.rol.id;


                        if ($scope.rootRoles.rolAGuardar.getId() === 0) {
                            $scope.rootRoles.rolAGuardar.setId(id);
                            $scope.onEmpresaSeleccionada();
                        }

                        AlertService.mostrarMensaje("success", "Rol guardado correctamente");


                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
                    }

                });

            };
            
            $scope.onVolver = function(){
                $state.go("ListarRoles");
            };

            $scope.onLimpiarFormulario = function() {
                self.inicializarRolACrear();
            };

            //se carga las empresas despues que el arbol esta listo
            $scope.$on("arbolListoEnDom", function() {
            });


            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.rootRoles = {};
                $scope.rootModulos = {};
                $scope.$$watchers = null;
            });


            //valida si hay un rol que se busco en el view de listar roles
            var rol_id = localStorageService.get("rol_id");


            if (rol_id && rol_id.length > 0) {
                self.inicializarRolACrear();
                self.traerRolPorId(rol_id, function() {
                    self.traerModulosPorRol(function() {

                        self.traerEmpresas();

                    });
                });
            } else {
                self.inicializarRolACrear();
                self.traerEmpresas();
            }

        }]);
});