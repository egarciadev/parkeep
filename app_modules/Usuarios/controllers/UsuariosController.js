
var Usuarios = function(usuarios) {

    console.log("Modulo Usuarios Cargado ");

    this.m_usuarios = usuarios;

};



Usuarios.prototype.listarUsuarios = function(req, res) {
    var that = this;

    var args = req.body.data;

    if (args.lista_usuarios.termino_busqueda === undefined || args.lista_usuarios.estado_registro === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var termino_busqueda = args.lista_usuarios.termino_busqueda;
    var estado_registro = args.lista_usuarios.estado_registro;
    var pagina = args.lista_usuarios.pagina_actual || 0;


    this.m_usuarios.listar_usuarios_sistema(termino_busqueda, estado_registro, pagina, function(err, lista_usuarios) {
        res.send(G.utils.r(req.url, 'Lista Usuarios Sistema', 200, {lista_usuarios: lista_usuarios}));
    });
};


Usuarios.prototype.obtenerUsuarioPorId = function(req, res){
    var that = this;

    var args = req.body.data;
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }

    if (args.parametrizacion_usuarios.usuario_id === undefined || args.parametrizacion_usuarios.usuario_id.length === 0) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var usuario_id = args.parametrizacion_usuarios.usuario_id;


    this.m_usuarios.obtenerUsuarioPorId(usuario_id, function(err, usuario) {
		console.log("error generado ", err);
        delete usuario.passwd;
        res.send(G.utils.r(req.url, 'Usuario', 200, {parametrizacion_usuarios: {usuario:usuario}}));
    });
};

Usuarios.prototype.guardarUsuario = function(req, res) {
    var that = this;

    var args = req.body.data;
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }

    if (args.parametrizacion_usuarios.usuario === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    var usuario = args.parametrizacion_usuarios.usuario;

    that.m_usuarios.guardarUsuario(usuario, function(err, usuario) {

        if(err){
            var msj = "Error guardando el usuario";
            
            if(err.msj){
                msj = err.msj;
            }
            
            res.send(G.utils.r(req.url, msj, 403, {parametrizacion_usuarios: {}}));
            return;
        }

        res.send(G.utils.r(req.url, 'Usuario guardado correctamente', 200, {parametrizacion_usuarios: {usuario: usuario}}));
    });
};


Usuarios.prototype.subirAvatarUsuario = function(req, res) {
     var that = this;

    var args = req.body.data;
    
    if(args.parametrizacion_usuarios === undefined){
        res.send(G.utils.r(req.url, 'La sintaxis del request no es valida', 404, {}));
        return;
    }

    if (args.parametrizacion_usuarios.usuario_id === undefined || args.parametrizacion_usuarios.usuario_id.length === 0 ) {
        res.send(G.utils.r(req.url, 'El id del usuario no esta definido', 404, {}));
        return;
    }
    
    
    __subirAvatarUsuario(req.body, req.files, function(continuar,nombreArchivo){
        if(!continuar){
            res.send(G.utils.r(req.url, 'Se genero un error al subir la imagen', 403, {}));
            return;
        }
        
        that.m_usuarios.guardarAvatarUsuario(args.parametrizacion_usuarios.usuario_id, nombreArchivo, function(err, rows){
            
            if(err){
                res.send(G.utils.r(req.url, 'Se genero un error al subir la imagen', 403, {}));
                return;
            }
            
            res.send(G.utils.r(req.url, 'Usuario guardado correctamente', 200, {parametrizacion_usuarios: {avatar: nombreArchivo}}));
        });
                
        
    });
    
};

function __subirAvatarUsuario(data, files, callback) {

    
     
    var ruta_tmp = files.file.path;
    var ext = G.path.extname(data.flowFilename);
    var usuario_id = data.data.parametrizacion_usuarios.usuario_id;
    var nombre_archivo =  usuario_id  + ext;
    var ruta_nueva = G.dirname + G.settings.carpeta_avatars + usuario_id+ "/";
    

    if (G.fs.existsSync(ruta_tmp)) {
        
        if(!G.fs.existsSync(ruta_nueva)){
            G.fs.mkdirSync(ruta_nueva);
        }
        
        // Copiar Archivo
        G.fs.copy(ruta_tmp, ruta_nueva + nombre_archivo, function(err) {
            if (err) {
                // Borrar archivo fisico
                G.fs.unlinkSync(ruta_tmp);
                callback(false);
                return;
            } else {
                G.fs.unlink(ruta_tmp, function(err) {
                    if (err) {
                        callback(false);
                        return;
                    } else {
                        callback(true, nombre_archivo);
                    }
                });
            }
        });
    } else {
        callback(false);
    }
};


Usuarios.$inject = ["m_usuarios"];

module.exports = Usuarios;