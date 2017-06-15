//Controlador de la View verpedidosfarmacias.html

define(["angular",
    "js/controllers",
    'includes/Constants/Url', 'includes/classes/Lote'], function(angular, controllers) {

    controllers.controller('NotificacionesController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", 'URL','webNotification', 'Conversacion',
        function($scope, $rootScope, Request,
                API, socket, AlertService,
                $state, Usuario, URL, webNotification, Conversacion) {

            var self = this;
            $rootScope.conversacionesSinLeer = [];
            $rootScope.conversacionSeleccionada = Conversacion.get();
            
            /*
             * @Author: Eduar
             * @params{object} {titulo, mensaje, moduloAlias, moduloOpcion}
             * +Descripcion: Permite escuchar el evento de web notification enviado del servidor
             */
            
            socket.on("onRealizarNotificacionWeb", function(datos){
                
                if(self.validarNotificacion(datos)){
                    self.mostrarNotificacionWeb(datos.titulo, datos.mensaje);
                } else {
                    console.log("el usuario no tiene permisos para ver la notificacion ", datos);
                }
                

            });
            
            /*
             * @Author: Eduar
             * @params{object} {titulo, mensaje, moduloAlias, moduloOpcion}
             * @return Boolean
             * +Descripcion: Valida si el usuario tiene permisos para ver las notificaciones 
             */
            
            self.validarNotificacion = function(datos){
                var usuario = Usuario.getUsuarioActual();
                
                if(usuario){
                    
                    var modulos = usuario.objetoModulos;
                    
                    //Modulos del usuario
                    if(modulos){
                        for(var i in modulos){
                            if(modulos[i].alias === datos.aliasModulo){
                                var opciones = modulos[i].opciones;
                                for(var ii in opciones){
                                    var opcion = opciones[ii];
                                    //Valida si la opcion esta habilitada
                                    if(ii === datos.opcionModulo && opcion){
                                        return true;
                                    }                                   
                                }
                            }
                        }
                    }
                }
                
                return false;
            };
            
            /*
             * @Author: Eduar
             * @params {String titulo, String mensaje}
             * +Descripcion: Valida si el usuario tiene permisos para ver las notificaciones 
             */
            self.mostrarNotificacionWeb = function(titulo, mensaje){
                webNotification.showNotification(titulo, {
                    body: mensaje,
                    icon: '/images/logo.png',
                    onClick: function onNotificationClicked() {
                       
                    },
                    autoClose: 90000 //auto close the notification after 2 seconds (you can manually close it via hide function)
                }, function onShow(error, hide) {
                    if (error) {
                        console.log('Error interno: al mostrar ventana de web notifications ' + error.message);
                    } else {

                        setTimeout(function hideNotification() {
                           
                            hide(); //manually close the notification (you can skip this if you use the autoClose option)
                        }, 90000);
                    }
                });
            };
            
            
            
            $rootScope.conversacionConNotificacion = function(conversacionId){
                var conversaciones = $rootScope.conversacionesSinLeer;
                
                for(var i in conversaciones){
                    if(conversaciones[i] === conversacionId){
                        return true;
                    }
                }
                
                return false;
            };
            
            $rootScope.removerNotificacion = function(conversacionId){
                var conversaciones = $rootScope.conversacionesSinLeer;
                
                for(var i in conversaciones){
                    if(conversaciones[i] === conversacionId){
                        conversaciones.splice(i, 1);
                        self.enviarNuevaNotificacion(conversacionId);
                        break;
                    }
                }
                console.log("conversaciones remover ", conversaciones);
                
            };
            
            $rootScope.agregarNotificacion = function(conversacionId){
                var conversaciones = $rootScope.conversacionesSinLeer;
                
                for(var i in conversaciones){
                    if(conversaciones[i] === conversacionId){
                        return false;
                    }
                }
                
                conversaciones.push(conversacionId);
                self.enviarNuevaNotificacion(conversacionId);
                //$rootScope.$emit("onConversacionesSinLeer", conversaciones);
            };
            
            self.enviarNuevaNotificacion = function(conversacionId){
                if(conversacionId !== $rootScope.conversacionSeleccionada.getId()){
                    
                    $rootScope.$emit("onConversacionesSinLeer", $rootScope.conversacionesSinLeer);
                }
            };
            
            
        }]);

});
