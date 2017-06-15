define(["angular","js/directive", "includes/slide/transition"], function(angular, directive){

    directive.directive('slideContent',["$rootScope",function($rootScope) {
       var slide =  {
          margen: 2000,

          link:function(scope, element, attrs) {
             
             //console.log(attrs)
          },
          
          /*scope: {
            'closeCallback' : '=',
            'openCallback' : '='
          },*/
          controller: ["$scope", "$element", "$attrs",function($scope, $element, $attrs) {
              
              
              if(($attrs.closeCallback === undefined || $attrs.closeCallback.length === 0) || 
                  ($attrs.openCallback === undefined || $attrs.openCallback.length === 0)){
                 throw "No se han declarado los callbacks para el slide";
                 return;
              }
              
             
              
              angular.element(document).ready(function() {
                  //modal del slider
                  var modalslide = $("#contenedormodalslide");

                  if(!modalslide.length > 0){
                    $(document.body).append("<div id='contenedormodalslide'> </div>");
                    modalslide = $("#contenedormodalslide");
                  }
                  
                  modalslide.css({"background-color":"rgba(112,112,112, 0.2)"});
                  
                  //modalslide.html($element);

                  //asegura que el slide este cerrado
                  slide.cerrarslide($element, false, modalslide);

                  //emite al menu que ha sido cargado el slide
                  $rootScope.$emit("slidecargado");

                  //determina el margen del slide cuando el menu esta listo
                  $rootScope.$on("configurarslide",function(){
                    slide.configurarSlide($element, modalslide);
                  });

                  //configura el ancho del slide de acuerdo al evento de resize del navegador
                  $( window ).resize(function() {

                    if($(window).width() < 1688){
                      menuWidth = 10;
                    }

                    slide.configurarSlide($element, modalslide);
                  });

                  //coloca el elemento en el body
                  if($(".slide").length === 0){
                    $(document.body).append($element.detach());
                  }
                  
                  $scope.$on($attrs.openCallback, function($event) {
                      var datos = arguments;
                     slide.mostrarslide($element, modalslide, $attrs, datos, $scope);
                  });

                  $scope.$on($attrs.closeCallback, function($event, datos) {
                      if(!datos){
                          datos = {animado :false};
                      }
                      slide.cerrarslide($element, datos.animado, modalslide, $attrs, $scope);
                  });
              });  
          }],

          configurarSlide : function($element, contenedor){
              var parent = $(".contenidoPrincipal");
              var width  = parent.width();
              var height = parent.height();
              //console.log("configure slide with width "+width);
              $element.width(width +25);
              contenedor.height(document.body.scrollHeight);
          },

          mostrarslide: function($element, contenedor, $attrs, datos, scope){
            $element.css({"display":"block"});
            contenedor.show();
            $element.transition({ x: '0px', duration:1000}, function(){
                //console.log("open callback completo ", $attrs.openCallback);
                scope.$emit($attrs.openCallback+"Completo", datos);
            });
           
          },

          cerrarslide: function($element, animado, contenedor, $attrs, scope){
            contenedor.hide();
            var rootWidth = $(window).width() +slide.margen;
            var duration = (animado)?1000:0;
            $element.transition({ x: rootWidth+"px", duration:duration},function(){
               $element.css({"display":"none"});
              
               if($attrs){
                   scope.$emit($attrs.closeCallback+"Completo");
               }
                
            });

          }

       };

       return slide;
       
    }]);

});
