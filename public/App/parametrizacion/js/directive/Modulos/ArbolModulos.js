define(["angular", "js/directive"], function(angular, directive) {

    directive.directive('arbolModulos', ["$state", "$rootScope", "$timeout", function($state, $rootScope, $timeout) {

            return {
                link: function(scope, element, attrs, ngModel) {

                    //evento que indica que el elemento se cargo en el dom
                    scope.$emit("arbolListoEnDom");

                    scope.modulosSeleccionados = {
                        padres: [],
                        hijos: []
                    };

                    // var plugins = ["state"];
                    var plugins = [];

                    if (attrs.plugins) {
                        plugins = plugins.concat(attrs.plugins.split(","));
                    }

                    //determina que los datos del arbol cambiaron, actualiza los nodos
                    scope.$on("datosArbolCambiados", function(e, datos) {
                       // console.log("refrescar arbol code 3");
                        if (datos) {
                            //valida si se debe refrescar el arbol o simplemente inicializarlo
                            if (element.jstree(true).settings) {
                                element.jstree(true).settings.core.data = datos;
                                element.jstree(true).refresh();
                            } else {
                                init(datos);
                            }
                        }
                    });
                    
                    
                    scope.$parent.obtenerHijosSeleccionados = function(parent_id){
                        var hijos = [];
                        $("#modulo_"+parent_id).find("li").each( function( idx, listItem ) {
                            var child = $(listItem); 
                            
                            if(element.jstree(true).is_selected(child)){
                                hijos.push(listItem);
                            }
                        });
                        
                        return hijos;
                    };
                    
                    
                    scope.$on("onseleccionarnodo", function(e, id, parent_id){
                        var node = "#" + id;
                        var padre = "#" +parent_id;
                        /*var padre = element.jstree(true)._get_parent(node);
                        element.jstree(true).refresh(padre);*/
                        element.jstree("select_node",  parent_id);
                        element.jstree("select_node",  id);
                    });
                    
                    scope.$on("deshabilitarNodos", function(){
                       element.jstree("deselect_all"); 
                    });

                    scope.onSeleccionarNodo = function(nodo) {
                        //evita que se seleccione otro nodo diferente al actual
                        if (scope.modulosSeleccionados.seleccionado && !attrs.multiplesNodos) {

                            //deselecciona todos los nodos para evitar multiples nodos
                            element.jstree("deselect_all");
                            scope.modulosSeleccionados = {
                                padres: [],
                                hijos: []
                            };

                            //se vuelve a seleccionar el nodo que el usuario eligio
                            element.jstree("select_node", "#" + nodo.id);
                            return;

                        } else if (attrs.multiplesNodos) {
                            scope.modulosSeleccionados = {
                                padres: [],
                                hijos: []
                            };
                        }
                        
                        //se agrega el nodo seleccionado
                        scope.modulosSeleccionados.seleccionado = nodo.original.modulo_id;

                        if (attrs.tipo === 'multiple') {
                            //agrega los nodos padres+
                            for (var i in nodo.parents) {
                                agregarModuloSeleccionado(scope, nodo.parents[i], "padres");
                            }

                            //agrega los nodos hijos
                            for (var ii in nodo.children_d) {
                                agregarModuloSeleccionado(scope, nodo.children_d[ii], "hijos");
                            }

                        }


                        //console.log("modulos seleccionados ",scope.modulosSeleccionados)
                        if(!nodo.original.modoLectura){
                            scope.$emit("modulosSeleccionados", scope.modulosSeleccionados);
                        } else {
                            nodo.original.modoLectura = false;
                        }
                    };


                    scope.onDeshabilitarNodo = function(nodo) {

                        scope.modulosSeleccionados = {
                            padres: [],
                            hijos: []
                        };
                        
                        scope.modulosSeleccionados.seleccionado = nodo.original.modulo_id;
                        
                        //agrega los nodos padres
                        for (var i in nodo.parents) {
                            agregarModuloSeleccionado(scope, nodo.parents[i], "padres");
                        }

                        //agrega los nodos hijos
                        for (var ii in nodo.children_d) {
                            agregarModuloSeleccionado(scope, nodo.children_d[ii], "hijos");
                        }
                        
                        element.jstree("deselect_node", "#" + nodo.id);
                        scope.$emit("modulosDeshabilitados", scope.modulosSeleccionados);
                    };

                    function init(datos) {
                        element.jstree({
                            'core': {
                                data: datos,
                                "open_parents": true,
                                "themes": {"stripes": true}

                            },
                            "state": {"key": attrs.estado || ""},
                            plugins: plugins,
                            "sort": function(a,b){
                                
                                 if(this.get_text(b).toLowerCase() === "home"){
                                     return 1;
                                 }
                                
                                 return this.get_text(a) > this.get_text(b) ? 1 : -1; 
                            },
                            "contextmenu": {
                                select_node: false,
                                "items": function($node) {
                                    return {
                                         "VerOpciones": {
                                            "label": "Ver Opciones",
                                            "action": function(obj) {
                                                //las opciones solo estan disponibles para modulos hijos
                                                
                                                if($node.children_d.length === 0 && $node.state.selected){
                                                    scope.$emit("traerOpcioesModuloSeleccionado", $node.original.modulo_id);
                                                }
                                            }
                                         },
                                        "Seleccionar": {
                                            "label": "Seleccionar",
                                            "action": function(obj) {
                                                //scope.onSeleccionarNodo($node);
                                                
                                                if(!$node.state.selected){
                                                    element.jstree("select_node", "#" + $node.id);
                                                } else {
                                                    scope.onSeleccionarNodo($node);
                                                }
                                            }
                                        },
                                        "Deshabilitar": {
                                            "label": "Deshabilitar",
                                            "action": function(obj) {
                                                console.log("deshabilitar ", $node);
                                                if($node.state.selected){
                                                    scope.onDeshabilitarNodo($node);
                                                }
                                            }
                                        }
                                    };
                                }
                            }


                        }).on("select_node.jstree", function(node, selected, event) {
                            scope.onSeleccionarNodo(selected.node);

                        }).on("deselect_node.jstree", function(node, selected, event) {
                            return false;
                        }).on("refresh.jstree", function(node, selected, event) {
                           // console.log("arbol refrescado code 1");
                            scope.$emit("arbolRefrescado");
                        }).on("ready.jstree", function(){
                            console.log("arbol cargado >>>>>>>>>>>>>"); 
                            scope.$emit("arbolRefrescado");
                                
                            $(".jstree-anchor").attr("href", "javascript:void()");
                        });
                    }

                    //agrega los nodos padres e hijos
                    function agregarModuloSeleccionado(scope, modulo, tipo) {

                        modulo = modulo.split("_")[1];

                        if (!modulo) {
                            return;
                        }

                        for (var i in scope.modulosSeleccionados[tipo]) {
                            if (scope.modulosSeleccionados[tipo][i] === modulo) {
                                return false;
                            }
                        }

                        scope.modulosSeleccionados[tipo].push(modulo);
                    }

                }
            };
        }]);

});

