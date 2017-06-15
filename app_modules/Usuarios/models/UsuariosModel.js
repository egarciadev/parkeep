var UsuariosModel = function() {
};



// Lista los usuarios del sistema, permite buscar por nombre, login o descripcion
UsuariosModel.prototype.listar_usuarios_sistema = function(termino_busqueda, estado, pagina, callback) {
    var sql_aux = ";";
    if (estado !== '') {
        sql_aux = " and a.activo = '" + estado + "'";
    }

    var sql = " * FROM usuarios a where (a.usuario "+G.constants.db().LIKE+" :1\
               or a.nombre "+G.constants.db().LIKE+" :1 or a.descripcion "+G.constants.db().LIKE+" :1 ) " + sql_aux;
    
    var query = G.knex.select(G.knex.raw(sql, {1:"%" + termino_busqueda + "%"}));

    if (pagina !== 0) {        
        query.limit(G.settings.limit).
        offset((pagina - 1) * G.settings.limit);
    }
    
    query.then(function(resultado){
        callback(false, resultado.rows || resultado);

    }).catch(function(err){
        console.log("error ", err);
        callback(err);
    });

};

// Selecciona un usuario por el ID
UsuariosModel.prototype.obtenerUsuarioPorId = function(usuario_id, callback) {

    var sql = "SELECT a.*, b.ruta_avatar, c. * FROM usuarios a\
                LEFT JOIN usuarios_configuraciones b ON a.usuario_id = b.usuario_id\
                LEFT JOIN (\
                        SELECT bb.id as id_rol, bb.nombre as nombre_rol, bb.observacion as observacion_rol , aa.login_id, aa.id as login_empresas_id, aa.empresa_id FROM login_empresas aa\
                        INNER JOIN roles bb ON aa.rol_id = bb.id \
                        WHERE aa.predeterminado = '1' AND aa.login_id = :1 \
                ) c ON a.usuario_id = c.login_id\
                where a.usuario_id = :1;  ";
    
    G.knex.raw(sql, {1:usuario_id}).then(function(resultado){
		console.log("resultado >>>>>>>>>>>>>>>> ", resultado);
        callback(false, (resultado.rows.length > 0) ? resultado.rows[0] : null);

    }).catch(function(err){
        callback(err);
    });
};

// Selecciona un usuario por el login
UsuariosModel.prototype.obtenerUsuarioPorLogin = function(login, callback) {

    var sql = "SELECT * FROM usuarios a where a.usuario = :1; ";
    
    G.knex.raw(sql, {1:login}).then(function(resultado){
        callback(false, (resultado.rows.length > 0) ? resultado.rows : null);

    }).catch(function(err){
        callback(err);
    });
};


UsuariosModel.prototype.cambiar_contrasenia = function(usuario, contrasenia, callback) {

    var sql = "UPDATE usuarios SET passwd=MD5( :2 ) WHERE usuario = :1";
    
    G.knex.raw(sql, {1:usuario, 2:contrasenia}).then(function(resultado){
        console.log("resultaod ", resultado,  resultado.rows);
        callback(false, resultado);

    }).catch(function(err){
        console.log("error al cambiar clave ", err);
        callback(err);
    });
};


//gestiona para modificar o insertar el rol
UsuariosModel.prototype.guardarUsuario = function(usuario, callback) {
    var self = this;

    __validarCreacionUsuario(self, usuario, function(validacion) {

        if (!validacion.valido) {
            var err = {msj: validacion.msj};
            callback(err, false);
            return;
        }

        self.modificarUsuario(usuario, function(err, rows, result) {
            if (err) {
                callback(err, rows);
                return;
            }

            if (result.rowCount === 0) {

                self.insertarUsuario(usuario, function(err, rows) {
                    callback(err, rows);
                });

            } else if (usuario.clave.length > 0) {
                self.cambiar_contrasenia(usuario.usuario, usuario.clave, function(err) {
                    if (err) {
                        callback(err, rows);
                        return;
                    }

                    callback(err, rows);
                });
            } else {
                callback(err, rows);
            }
        });
    });

};


UsuariosModel.prototype.insertarUsuario = function(usuario, callback) {

    var sql = "INSERT INTO usuarios (usuario, nombre, passwd, activo,\
               fecha_caducidad_contrasena, descripcion, email) VALUES ( :1, :2, md5( :3 ), :4, :5, :6, :7 ) RETURNING usuario_id";


    var params = {
        1:usuario.usuario, 2:usuario.nombre, 3:usuario.clave, 4:Number(usuario.estado), 5:usuario.fechaCaducidad, 6:usuario.descripcion, 7:usuario.email
    };
    
    G.knex.raw(sql, params).then(function(resultado){
        var usuario_id = (resultado.rows.length > 0) ? resultado.rows[0] : undefined;
        callback(false, usuario_id);

    }).catch(function(err){
        callback(err);
    });
};

UsuariosModel.prototype.modificarUsuario = function(usuario, callback) {
	console.log("usuario >>>>>>>>>>>>>> ", usuario);
    var sql = "UPDATE usuarios SET  usuario = :1, nombre = :2, activo= :3, fecha_caducidad_contrasena = :4,\
               email = :5, descripcion = :6  WHERE usuario_id = :7 RETURNING usuario_id";

    var params = {
        1:usuario.usuario, 2:usuario.nombre, 3:Number(usuario.estado), 4:usuario.fechaCaducidad,
        5:usuario.email, 6:usuario.descripcion, 7:usuario.id
    };
    
    G.knex.raw(sql, params).then(function(resultado){
        var usuario_id = (resultado.rows.length > 0) ? resultado.rows[0] : undefined;
        callback(false, usuario_id, resultado);

    }).catch(function(err){
        callback(err);
    });
    
};

UsuariosModel.prototype.obtenerUsuarioPorNombreOEmail = function(usuario, email, callback) {
    var sql = "SELECT  nombre, usuario_id, email, usuario  FROM usuarios WHERE usuario "+G.constants.db().LIKE+" :1 OR email = :2";
    
    G.knex.raw(sql, {1:usuario + "%", 2:email}).then(function(resultado){
        callback(false, resultado.rows);

    }).catch(function(err){
        callback(err);
    });
};



UsuariosModel.$inject = [];

module.exports = UsuariosModel;