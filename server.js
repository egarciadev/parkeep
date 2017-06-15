/*=========================================
 * Modulos y Dependecias
 * =========================================*/
var express = require('express');
var modulos = require('./app_modules/');
var http = require('http');
var path = require('path');
var intravenous = require('intravenous');
var nodemailer = require('nodemailer');
var date_utils = require('date-utils');
var multipart = require('connect-multiparty');

var accounting = require("accounting");
var cacheKey = "Parkey";


if(process.argv.indexOf("cacheKey") !== -1){ 
    cacheKey = process.argv[process.argv.indexOf("cacheKey") + 1]; 
    console.log("Limpiar cache con llave ", cacheKey);
} 


/*=========================================
 * Variables Globales
 * =========================================*/
G = {};
G.dirname = __dirname;
G.settings = require('./lib/Settings').create();
G.utils = require('./lib/Utils');
G.random = require('./lib/Random');
G.auth = require('./lib/Authentication');
G.fs = require('fs-extra');
G.path = path;
G.Q = require('q');
G.accounting = accounting;
G.moment = require("moment");
G.jsonQuery = require('jinq');
G.fcmPush = require('fcm-push');
var events = require('events');
G.eventEmitter = new events.EventEmitter();


G.program = require('commander');


G.program
        .version(G.settings.version)
        .option('-p, --port <n>', 'Run server on provided port', parseInt)
        .option('-d, --dev', 'Run server in Development mode')
        .option('-t, --test', 'Run server in Testing mode')
        .option('-e, --eco', 'Run server in Testing mode in ecodev')
        .option('-P, --prod', 'Run server in Production mode')
        .option('-c, --config', 'Output settings');
G.program.parse(process.argv);

G.constants =  require("./lib/Constants").create();

/*=========================================
 * Configuracion de Enviroment
 * =========================================*/
if (G.program.dev)
    G.settings.setEnv(G.settings.envDevelopment());
else if (G.program.test)
    G.settings.setEnv(G.settings.envTesting());
else if (G.program.prod)
    G.settings.setEnv(G.settings.envProduction());
else
    G.settings.setEnv(G.settings.env);

if (G.program.port)
    G.settings.server_port = G.program.port;


if (G.program.config) {
    G.settings.outputConfig();
    return;
}




/*=========================================
 * Inicializacion del Servidor
 * =========================================*/

//determina el numero de procesadores del servidor, de modo que se concrete los workers que permite el balanceo de carga
    
G.knex = require('./lib/Knex').
         create(G.settings.dbHost, G.settings.dbUsername, G.settings.dbPassword, G.settings.dbName).
         connect().getInstance();
     

var cluster = require('cluster'),
        RedisStore = require("socket.io-redis"),
        redis = require("redis"),
        pub = redis.createClient(6379, "localhost", {return_buffers: true}),
        sub = redis.createClient(6379, "localhost", {return_buffers: true}),
        client = redis.createClient();   

G.cronJob = require('cron-cluster')(client).CronJob;
G.redis = client;

if (cluster.isMaster) {

    var numCPUs = require('os').cpus().length;
    console.log("number of CPUS ", numCPUs );

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
        G.knex.destroy();
        //se reemplaza el worker que acaba de caer
        cluster.fork();
    });
    
} else {


    var app = express();
    var server = app.listen(G.settings.server_port);
    var io = require('socket.io').listen(server);
    var container = intravenous.create();

    
    var redisOptions = {
        pubClient: pub,
        subClient: sub,
        host: "redis://localhost",
        port: 6379
    };
    
    io.adapter(RedisStore(redisOptions));
    

    /*=========================================
     * Registrar dependecias en el contendorDI
     * =========================================*/
    container.register("emails", nodemailer);
    container.register("date_utils", date_utils);
    container.register("socket", io);


    app.use(express.compress({
        threshold : 0
    }));
    
    var tiempo = 10800000;
	
    
    app.set('port', process.env.PORT || G.settings.server_port);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
	app.use(express.favicon()); 
    app.use(express.logger('dev'));
    app.use(multipart());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    
    //========================================
    app.use(express.cookieParser('parkep123'));
    app.use(express.session());
    //========================================
    app.use(G.utils.validar_request());
    app.use(G.auth.validate());
    app.use(app.router);
    
    if (G.program.prod) {
        app.use(express.static(path.join(__dirname, 'public'), { maxAge: tiempo } ));
    } else {
        app.use(express.static(path.join(__dirname, 'public')));
    }
    
    app.use(express.static(path.join(__dirname, 'files')));
    
    /*=========================================
     * error handlers
     * development error handler
     * will print stacktrace
     * =========================================*/
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            console.log(err);
            res.send(G.utils.r(req.url, 'Se ha generado un error interno code 1  ', 500, {msj: err}));
        });
    }

    /*=========================================
     * production error handler
     * no stacktraces leaked to user
     * =========================================*/
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err);
        res.send(G.utils.r(req.url, 'Se ha generado un error interno code 2', 500, {msj: err}));
    });
	
    modulos.cargarRoutes(app, container, io);


    app.all('/App', function(req, res) {
        res.redirect('/App/login');
    });
    

    //Permite hacer render de reglas especificas de css para el entorno de pruebas
    app.all('/stylesheets/style.css', function(req, res, next){
        console.log("params for query ", req.query);
        
        //Si es produccion se hace render del css normal
        if(G.program.prod || req.query.prod) {
           next();
           return;
        } else {
           var path = "public/stylesheets/style-dev.css";
           var file = G.fs.readFileSync(path);
           res.writeHeader(200, {"Content-Type": "text/css"});  
           res.write(file);
           res.end(); 
        }
        
                
    });
    
    //Obtiene contenido estatico basado en la llave de cache
    app.all("*",function(req, res, next){
        var url = req.protocol + '://' + req.get('host') + req.originalUrl;

        if(req.originalUrl.match(/[^/]+(jpg|png|gif|html|css|js)$/)){
            
            //La validacion del archivo del main-dev se delega en otro router
            if(!req.originalUrl.match(/main-dev/g)){
                res.redirect(req.originalUrl+ "?c="+cacheKey);
                return;
            }

        }
        
        next();

    });
    
    //Si el servidor esta en modo produccion se sobreescribe el mand-dev.js por el de produccion
    app.all('/App/:type(*)/main-dev.js', function(req, res, next) {
        
        if(!G.program.prod ) {
           next();
           return;
        } else {
            var url = req.protocol + '://' + req.get('host') + req.originalUrl;
            res.redirect(url.replace("main-dev", "dist/main")+ "?c="+cacheKey);
        }
    });

    process.on('SIGINT', function() {
        io.sockets.emit('onDisconnect');


        for (var id in cluster.workers) {
            console.log("killing worker ", cluster.workers[id]);
            cluster.workers[id].kill();
        }
        // exit the master process
        process.exit(0);

    });

    console.log('Express server listening on port _______________________________ ' + app.get('port') + ' in Dir ' + __dirname);

}