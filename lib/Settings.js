var Settings = function() {

    this.server_name = "Servidor Parkeep";
    this.server_port = "3000";
    this.version = "0.0.1";

    this.dev_serverPort = "3000";
    this.test_serverPort = "3001";
    this.prod_serverPort = "3002";
    this.reports_serverPort = "3003";
    this.reportsUrl = "http://10.0.2.229:" + this.reports_serverPort;
    this.dbHost = "";
    this.dbName = "";
    this.dbPort = "";
    this.dbUsername = "";
    this.dbPassword = "";


    this.dev_dbHost = "162.243.254.239";
    this.dev_dbName = "parkeep";
    this.dev_dbPort = "5432";
    this.dev_dbUsername = "parkeep";
    this.dev_dbPassword = "parkeep";
  
    this.dev_dbHost1 = "URL";
    this.dev_dbName1 = "";
    this.dev_dbPort1 = "5432";
    this.dev_dbUsername1 = "";
    this.dev_dbPassword1 = "";


    this.test_dbHost = "";
    this.test_dbName = "";
    this.test_dbPort = "5432";
    this.test_dbUsername = "";
    this.test_dbPassword = "";

    this.prod_dbHost = "162.243.254.239";
    this.prod_dbName = "parkeep";
    this.prod_dbPort = "5436";
    this.prod_dbUsername = "parkeep";
    this.prod_dbPassword = "parkeep";


    this.log_type = "console";
    this.server_type = "http";
    this.env = "dev";

    //Emails Settings
    this.email_administrator = "";
    this.email_sender = "";
    this.email_host = "";
    this.email_port = 465;
    this.email_user = "";
    this.email_password = "";
    this.email_compras = "";

    //Tiempo Maximo de Inactividad de Usuarios en Minutos
    this.max_time_inactive_user = 60;

    //Paginacion
    this.limit = 25;

    // Folders por Default TMP
    this.carpeta_temporal = '/files/tmp/';
    this.carpeta_admin = "/files/admin/";

    // Folders Ordenes Compra

    this.carpeta_avatars = '/public/images/Usuarios/Avatars/';


    this.request = {
        session: {
            usuario_id: '',
            auth_token: '',
            moduloActual: '',
            empresaId: '',
            centroUtilidad: '',
            bodega: ''
        },
        data: {}
    };

    this.response = {
        msj: '',
        status: '',
        data: []
    };

    updateEnv(this);
};


Settings.prototype.set = function(config) {

    var settings = Object.keys(this);

    settings.forEach(function(item) {
        if (item in config) {
            G.settings[item] = config[item];
        }
    });
};

Settings.prototype.envDevelopment = function() {
    return "dev";
};

Settings.prototype.envTesting = function() {
    return "test";
};

Settings.prototype.envProduction = function() {
    return "prod";
};

Settings.prototype.setEnv = function(_env) {
    this.env = _env;
    updateEnv(this);
};

function updateEnv(context)
{

    if (context.env === "dev") {
        context.server_port = context.dev_serverPort;
        context.dbHost = context.dev_dbHost;
        context.dbName = context.dev_dbName;
        context.dbPort = context.dev_dbPort;
        context.dbUsername = context.dev_dbUsername;
        context.dbPassword = context.dev_dbPassword;
    }
    else if (context.env === "test") {
        context.server_port = context.test_serverPort;
        context.dbHost = context.test_dbHost;
        context.dbName = context.test_dbName;
        context.dbPort = context.test_dbPort;
        context.dbUsername = context.test_dbUsername;
        context.dbPassword = context.test_dbPassword;
    }
    else if (context.env === "prod") {
        context.server_port = context.prod_serverPort;
        context.dbHost = context.prod_dbHost;
        context.dbName = context.prod_dbName;
        context.dbPort = context.prod_dbPort;
        context.dbUsername = context.prod_dbUsername;
        context.dbPassword = context.prod_dbPassword;
    }
}


Settings.prototype.outputConfig = function() {
    console.log('========== Configuracion del Servidor ==========');
    console.log('= Version API:         ' + this.version);
    console.log('= Ambiente :           ' + this.env);
    console.log('= Nombre Servidor :    ' + this.server_name);
    console.log('= Puerto :             ' + this.server_port);
    console.log('== Conexion Base de Datos ==');
    console.log('= Host :               ' + this.dbHost);
    console.log('= Puerto :             ' + this.dbPort);
    console.log('= Base Datos :         ' + this.dbName);
    console.log('= Usuario :            ' + this.dbUsername);
    console.log('= ContraseÃ±a :         ***********');
    console.log('=================================================');
};

Settings.prototype.className = "Settings";



module.exports.create = function() {
    return new Settings();
};

module.exports._class = Settings;

