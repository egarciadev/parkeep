define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('Logincontroller', ['$scope', 'Usuario', "Request", "localStorageService","$modal","AlertService",
        function($scope, Usuario, Request, localStorageService, $modal, AlertService) {

            console.log("init login controller");
            $scope.usuario = "";
            $scope.clave = "";
            $scope.mostrarmensaje = false;
            $scope.ocultar_formulario = true;
            $scope.slides = [];
            $scope.myInterval = 5000;
            $scope.loginform = {};
            $scope.formularioLogin = true;
            
            $scope.slides.push(
                {
                    image: '../../images/login/imgchat.png',
                    text: "",
                    id: 0
                },
                {
                    image: '../../images/login/imgdbodega.png',
                    text: "",
                    id: 1
                },
                {
                    image: '../../images/login/dusoftbodega.png',
                    text: "",
                    id: 2
                },
                {
                    image: '../../images/login/imgpedido.png',
                    text: "",
                    id: 3
                }
            );

            $scope.autenticar = function(usuario, clave) {
                console.log("usuario ", usuario, " clave ", clave)
                if (usuario.length === 0 || clave === 0) {
                    return;
                }
               

                var obj = {
                    session: {
                        usuario_id: "",
                        auth_token: ""
                    },
                    data: {
                        login: {
                            usuario: usuario,
                            contrasenia: clave,
                            device:"web",
                            appId:"myjobj-web"
                        }
                    }
                };
                Request.realizarRequest("/login", "POST", obj, function(datos) {
                    if (datos.status === 200) {
                        localStorageService.add("session", JSON.stringify(datos.obj.sesion));
                        /*window.location = "../home/";*/
						AlertService.mostrarVentanaAlerta("Mensaje del sistema",JSON.stringify(datos.obj.sesion));
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", datos.msj || "Ha ocurrido un error...");
                        $scope.mostrarmensaje = true;
                        $scope.msgerror = datos.msj || "Ha ocurrido un error...";
                    }
                });

            };
            

            $scope.recuperarContrasenia = function(usuario) {
                if (usuario.length === 0) {
                    return;
                }

                var obj = {
                    session: {
                        usuario_id: "",
                        auth_token: ""
                    },
                    data: {
                        login: {
                            usuario: usuario
                        }
                    }
                };
                

                Request.realizarRequest("/forgout", "POST", obj, function(datos) {
                    
                    if (datos.status === 200) {
                        $scope.mostrarmensaje = false;
                        $scope.ocultar_formulario = false;
                        $scope.usuario="";
                        $scope.msj = datos.msj;
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Se ha enviado un correo con la nueva contraseña");
                        
                    } else {
                        $scope.mostrarmensaje = true;
                        $scope.msgerror = datos.msj || "Ha ocurrido un error...";
                    }
                });
            };
            
            $scope.abrirVentanaLogin = function(){
                console.log("abrirVentanaLogin ");
                    $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    transclude: true,   
                    windowClass: 'contenedorLogin',
                    templateUrl:"views/ventanaLogin.html" ,
                    scope: $scope,
                    controller:["$scope", "$modalInstance", function($scope, $modalInstance ){
                        $scope.onCerrarVentana = function(){
                            $modalInstance.close();
                        }
                    }]
                };
                var modalInstance = $modal.open($scope.opts);
            }
            
            if(localStorageService.get("session")){
                /*window.location = "../home/";
                return;*/
            }
        }]);
    
});
