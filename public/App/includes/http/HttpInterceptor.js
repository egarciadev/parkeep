define(["angular","js/services"], function(angular, services){
    services.factory('HttpInterceptor', ["$q","Usuario", function ($q, Usuario) {
        return {
            'response':function(response){
                var auth = true;
                if(response.headers()['content-type'] === "application/json; charset=utf-8" && auth){

                    //el usuario actual no esta autenticado en el api, el token no es valido
                    if(response.data.status === 401){
                        localStorage.removeItem("ls.session");
                        window.location = "../pages/"+response.data.status+".html";
                        return;
                    }

                }

                return response;
            },
            'request':function(config){
                config.timeout = 1000000000;
                if(config.data && config.data.session){
                    var usuario = Usuario.getUsuarioActual() || null;
                    var modulo = (usuario) ? usuario.getModuloActual() : null;
                    var empresa = (usuario) ? usuario.getEmpresa() : null;
                    var centro = (empresa) ? empresa.getCentroUtilidadSeleccionado() : null;
                    var bodega = (centro) ? centro.getBodegaSeleccionada() : null;
                                        
                    config.data.session.moduloActual = (modulo && modulo.alias) ? modulo.alias : "";
                    config.data.session.empresaId = (empresa && empresa.getCodigo()) ? empresa.getCodigo() : "";
                    config.data.session.centroUtilidad = (centro && centro.getCodigo()) ? centro.getCodigo() : "";
                    config.data.session.bodega = (bodega && bodega.getCodigo()) ? bodega.getCodigo() : ""; 
                }
                
                return config;
            }
        };
    }]);

});
