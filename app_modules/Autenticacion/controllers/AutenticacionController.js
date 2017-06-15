
var Autenticacion = function(usuarios, emails, m_auth) {

    console.log("Modulo Autenticacion Cargado ");

    this.m_usuarios = usuarios;
    this.emails = emails;
    this.m_auth = m_auth;
};




Autenticacion.prototype.loginUsuario = function(req, res) {

    var that = this;

    var args = req.body.data;
    
    var admin = args.login.admin || false;

    if (args.login === undefined || args.login.usuario === undefined || args.login.contrasenia === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.login.usuario === "" || args.login.contrasenia === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacíos', 404, {}));
        return;
    }


    var nombre_usuario = args.login.usuario;
    var contrasenia = args.login.contrasenia;
    var device = (args.login.device === undefined) ? '' : args.login.device;
    var appId = (args.login.appId === undefined) ? 'myjob-web' : args.login.appId;
    var socket = args.login.socket;


    G.auth.login(nombre_usuario, contrasenia, admin, function(err, usuario) {
        if (err){
            console.log("error interno ", err);
            res.send(G.utils.r(req.url, 'Error Interno', 500, {}));
        } else {
            if (usuario.length === 0) {
                res.send(G.utils.r(req.url, 'Usuario o Contraseña Invalidos', 404, {}));
            } else {

                usuario = usuario[0];
                usuario.socket = socket;
                usuario.device = device;
                usuario.appId = appId;
                

                G.auth.set(usuario, function(err, sesion_usuario) {
                    if (err) {
                        console.log("error generado ", err);
                        res.send(G.utils.r(req.url, 'No se ha podido Autenticar el Usuario', 500, {sesion: {}}));
                    } else {
                        sesion_usuario.admin = usuario.sw_admin;
                        res.send(G.utils.r(req.url, 'Usuario Autenticado Correctamente', 200, {sesion: sesion_usuario}));
                    }
                });
            }
        }
    });
};

Autenticacion.prototype.guardarTokenPush = function(req, res) {

    var that = this;
    var args = req.body.data;
    
    console.log("arguments >>>>>>>>>>>>>> ", args.autenticacion);

    G.Q.ninvoke(that.m_auth,'guardarTokenPush', args.autenticacion).then(function() {
        
        res.send(G.utils.r(req.url, 'Token dispositivo guardado', 200, {}));
      
    }).fail(function(err) {
        console.log("ocurrio un error ", err);
        res.send(G.utils.r(req.url, 'Error al guardar el token del dispositivo', 500, {usuarios: {}}));
    }).done();

};

Autenticacion.prototype.lockScreen = function(req, res) {

    var that = this;

    var usuario = req.session.user;

    G.auth.get(usuario.usuario_id, usuario.auth_token, function(err, session) {

        usuario.lock_screen = '1';

        G.auth.update(usuario, function(err, rows) {
            res.send(G.utils.r(req.url, 'Pantalla Bloqueada Correctame', 200, {}));
            return;
        });
    });
};

Autenticacion.prototype.sessions = function(req, res) {

    var that = this;
    console.log("app id here ", req.body);
    var args = req.body.data;

    var usuario = req.session.user;
    var appId = args.appId;

    G.auth.getSessionsUserByApp({usuario_id:usuario.usuario_id, appId:appId}, function(err, sessions) {

        if (err) {
            res.send(G.utils.r(req.url, 'Erros listando sesiones del usuario', 200, { sessions : []}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista de sesiones', 200, { sessions : sessions}));
            return;
        }

    });
};

Autenticacion.prototype.unLockScreen = function(req, res) {

    var that = this;

    var usuario = req.session.user;
    var args = req.body.data;

    if (args.login === undefined || args.login.contrasenia === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.login.contrasenia === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacíos', 404, {}));
        return;
    }


    G.auth.get(usuario.usuario_id, usuario.auth_token, function(err, session) {

        session.forEach(function(value) {

            G.auth.login(value.usuario, args.login.contrasenia, function(err, usuario) {
                if (err)
                    res.send(G.utils.r(req.url, 'Error Interno', 500, {}));
                else {
                    if (usuario.length === 0) {
                        res.send(G.utils.r(req.url, 'Contraseña Invalida', 404, {}));
                    } else {

                        usuario.lock_screen = '0';

                        G.auth.update(usuario, function(err, rows) {
                            res.send(G.utils.r(req.url, 'Pantalla Desbloqueada Correctame', 200, {}));
                            return;
                        });
                    }
                }
            });
        });
    });
};

Autenticacion.prototype.recuperarContrasenia = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.login === undefined || args.login.usuario === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.login.usuario === "") {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios Estan Vacíos', 404, {}));
        return;
    }

    var nombre_usuario = args.login.usuario;
    var constrasenia = G.random.randomKey(2, 8);

    var smtpTransport = this.emails.createTransport("SMTP", {
        host: G.settings.email_host, // hostname
        secureConnection: true, // use SSL
        port: G.settings.email_port, // port for secure SMTP
        auth: {
            user: G.settings.email_user,
            pass: G.settings.email_password
        }
    });

    this.m_usuarios.obtenerUsuarioPorLogin(nombre_usuario, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Se ha Generado un Error Interno al Cambiar la Contraseña del Usuario.', 500, {}));
            return;
        }

        if (rows.length > 0) {

            var usuario = rows[0];

            if (usuario.email) {

                var configuracion_email = {};
                configuracion_email.from = G.settings.email_sender;
                configuracion_email.to = usuario.email;
                configuracion_email.subject = "Dusoft :: Nueva Contraseña Generada"
                configuracion_email.text = "La Aplicacion Dusoft Ha generado una nueva contraseña, por favor no olvide cambiarla cuando inicie sesion.";
                configuracion_email.html = "Su nueva contraseña es : <b>" + constrasenia + "</b>";

                smtpTransport.sendMail(configuracion_email, function(error, response) {
                    if (error) {
                        console.log(error);
                        console.log(response);
                        res.send(G.utils.r(req.url, 'No se ha podido Enviar el Correo', 500, {}));
                        return;
                    } else {
                        smtpTransport.close();

                        that.m_usuarios.cambiar_contrasenia(nombre_usuario, constrasenia, function(err, result) {

                            if (err) {
                                res.send(G.utils.r(req.url, 'Se ha Generado un Error Interno al Cambiar la Contraseña del Usuario', 500, {}));
                                return;
                            }
                            if (result.rowCount > 0) {
                                res.send(G.utils.r(req.url, 'Se ha enviado un correo electronico con la nueva contraseña, por favor revicelo e Ingrese Nuevamente!!!!', 200, {}));
                                return;
                            } else {
                                res.send(G.utils.r(req.url, 'El Usuario No se Encuentra Registrado en la Aplicacion', 404, {}));
                                return;
                            }
                        });
                    }
                });
            } else {
                var msj = 'El Usuario NO tiene configurado una cuenta de correo Electronico, por lo tanto no es Posible generar la Nueva Contraseña. Consulte con el Administrador del Sistema'
                res.send(G.utils.r(req.url, msj, 200, {}));
                return;
            }
        } else {
            res.send(G.utils.r(req.url, 'El Usuario No se Encuentra Registrado en la Aplicacion', 404, {}));
            return;
        }
    });
};

Autenticacion.prototype.logoutUsuario = function(req, res) {

    G.auth.logout(req.session.user.usuario_id, req.session.user.auth_token, function(err, rows) {
        if (err)
            res.send(G.utils.r(req.url, 'Se ha Generado un Error Cerrando la Sesion del Usuario', 500, {sesion: {}}));
        else
            res.send(G.utils.r(req.url, 'Sesion Cerrada Correctamente', 200, {}));
    });
};

Autenticacion.$inject = ["m_usuarios", "emails", "m_auth"];

module.exports = Autenticacion;