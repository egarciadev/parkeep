
define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaParametrizacion', ['Empresa', function(Empresa) {

            function EmpresaParametrizacion(nombre, codigo, estado) {
                Empresa.getClass().call(this, nombre, codigo);
                this.empresasModulos = [];
                this.seleccionado = false;
                this.estado = Boolean(parseInt(estado));
                this.roles = [];
                this.predeterminada = false;
                this.login_empresa_id = 0;
            }

            EmpresaParametrizacion.prototype = Object.create(Empresa.getClass().prototype);


            EmpresaParametrizacion.prototype.vaciarListaEmpresas = function(opcion) {
                this.empresasModulos = [];
            };

            EmpresaParametrizacion.prototype.getListaEmpresas = function() {
                return this.empresasModulos;
            };

            EmpresaParametrizacion.prototype.agregarEmpresa = function(empresa_modulo) {
                for (var i in this.empresasModulos) {
                    var empresa = this.empresasModulos[i];
                    if (empresa_modulo.getEmpresa().getCodigo() === empresa.getEmpresa().getCodigo()
                            && empresa_modulo.getModulo().getId() === empresa.getModulo().getId()) {
                        this.empresasModulos[i] = empresa_modulo;
                        return;
                    }
                }

                this.empresasModulos.push(empresa_modulo);
            };

            EmpresaParametrizacion.prototype.setEstado = function(estado) {
                this.estado = estado;
            };

            EmpresaParametrizacion.prototype.getEstado = function() {
                return this.estado;
            };

            EmpresaParametrizacion.prototype.setLoginEmpresaId = function(login_empresa_id) {
                this.login_empresa_id = login_empresa_id;
            };

            EmpresaParametrizacion.prototype.getLoginEmpresaId = function() {
                return this.login_empresa_id;
            };

            EmpresaParametrizacion.prototype.setPredeterminado = function(predeterminada) {
                this.predeterminada = Number(predeterminada);
            };

            EmpresaParametrizacion.prototype.getPredeterminado = function() {
                return this.predeterminada;
            };

            EmpresaParametrizacion.prototype.getRoles = function() {
                return this.roles;
            };

            EmpresaParametrizacion.prototype.vaciarRoles = function() {
                this.roles = [];
            };

            EmpresaParametrizacion.prototype.agregarRol = function(_rol) {
                for (var i in this.roles) {
                    var rol = this.roles[i];
                    if (rol.getId() === _rol.getId()) {
                        return;
                    }
                }

                this.roles.push(_rol);
            };
            
            //@Override
            EmpresaParametrizacion.prototype.agregarCentroUtilidad = function(centroUtilidad) {
                for (var i in this.centrosUtilidad) {
                    var _centroUtilidad = this.centrosUtilidad[i];
                   /* if (_centroUtilidad.getCodigo() === centroUtilidad.getCodigo()) {
                        return false;
                    }*/
                }

                this.centrosUtilidad.push(centroUtilidad);
            };

            this.get = function(nombre, codigo, estado) {
                return new EmpresaParametrizacion(nombre, codigo, estado);
            };


            return this;

        }]);
});