requirejs.config({
    baseUrl: './',
    paths: {
        app: 'js/app',
        angular: "../../javascripts/angular/angular",
        route: "../../javascripts/angular/angular-ui-router",
        controllers: "js/controllers/",
        includes: "../includes/",
        models: "js/models",
        services:"js/services",
        directive: "js/directive",
        bootstrap: "../../javascripts/bootstrap/bootstrap",
        bootstrapLib:"../../javascripts/bootstrap/bootstrap.min",
        nggrid: "../../javascripts/angular/ng-grid",
        jquery: "../../javascripts/jquery",
        treemenu: "../includes/menu/myTree",
        tree: "../../javascripts/jstree",
       // select: "../../javascripts/select2",
        loader: "../includes/loader/loader",
        url: "js/constants/Url",
        socket: "../includes/socket/socket.io/socket.io",
        socketservice: "../includes/socket/socket",
        uiselect2: "../../javascripts/select",
        storage: "../../javascripts/angular/storage",
        dragndropfile:"../../javascripts/dragndropfile/ng-flow-standalone",
        desktopNotify:"../../javascripts/notifications/desktop-notify-min",
        webNotification:"../../javascripts/notifications/angular-web-notification"
    },
    shim: {
        "angular": {
            deps: ["jquery", "tree"],
            exports: "angular"
        },
        "route": {
            deps: ["angular"]
        },
        "bootstrap": {
            deps: ["angular"]
        },
        "bootstrapLib":{
            deps:["angular"]
        },
        "nggrid": {
            deps: ["jquery", "angular"]
        },
        "tree": {
            deps: ["jquery"]
        },
        "treemenu": {
            deps: ["tree"]
        },
        /*"select": {
            deps: ["jquery"]
        },*/
        "url": {
            deps: ["angular"]
        },
        "socketservice": {
            deps: ["socket"]
        },
        "uiselect2": {
            deps: ["angular", "jquery"]
        },
        "storage": {
            deps: ["angular"]
        },
        "dragndropfile":{
            deps:["angular"]
        }, 
        "desktopNotify":{
            deps:["angular"]
        },
        "webNotification":{
            deps:["desktopNotify"]
        }
    }
});

requirejs([
    "app"
]);