/*
 AngularJS v1.2.4
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(C,k,F){'use strict';k.module("ngAnimate",["ng"]).config(["$provide","$animateProvider",function(M,G){function l(l){for(var h=0;h<l.length;h++){var m=l[h];if(m.nodeType==T)return m}}var s=k.noop,m=k.forEach,N=G.$$selectors,T=1,h="$$ngAnimateState",J="ng-animate",g={running:!0};M.decorator("$animate",["$delegate","$injector","$sniffer","$rootElement","$timeout","$rootScope","$document",function(H,C,I,n,t,q,F){function O(a){if(a){var c=[],e={};a=a.substr(1).split(".");(I.transitions||I.animations)&&
a.push("");for(var f=0;f<a.length;f++){var b=a[f],l=N[b];l&&!e[b]&&(c.push(C.get(l)),e[b]=!0)}return c}}function p(a,c,e,f,b,g,q){function x(a){v();if(!0===a)w();else{if(a=e.data(h))a.done=w,e.data(h,a);p(y,"after",w)}}function p(f,b,l){var h=b+"End";m(f,function(m,g){var d=function(){a:{var d=b+"Complete",a=f[g];a[d]=!0;(a[h]||s)();for(a=0;a<f.length;a++)if(!f[a][d])break a;l()}};"before"!=b||"enter"!=a&&"move"!=a?m[b]?m[h]=z?m[b](e,c,d):m[b](e,d):d():d()})}function n(){q&&t(q,0,!1)}function v(){v.hasBeenRun||
(v.hasBeenRun=!0,g())}function w(){if(!w.hasBeenRun){w.hasBeenRun=!0;var a=e.data(h);a&&(z?A(e):(a.closeAnimationTimeout=t(function(){A(e)},0,!1),e.data(h,a)));n()}}var u=l(e);if(u){var u=u.className,k=(" "+(u+" "+c)).replace(/\s+/g,".");f||(f=b?b.parent():e.parent());var k=O(k),z="addClass"==a||"removeClass"==a;b=e.data(h)||{};if(K(e,f)||0===k.length)v(),w();else{var y=[];b.running&&z&&b.structural||m(k,function(b){if(!b.allowCancel||b.allowCancel(e,a,c)){var f=b[a];"leave"==a?(b=f,f=null):b=b["before"+
a.charAt(0).toUpperCase()+a.substr(1)];y.push({before:b,after:f})}});0===y.length?(v(),n()):(f=" "+u+" ",b.running&&(t.cancel(b.closeAnimationTimeout),A(e),L(b.animations),b.beforeComplete?(b.done||s)(!0):z&&!b.structural&&(f="removeClass"==b.event?f.replace(b.className,""):f+b.className+" ")),u=" "+c+" ","addClass"==a&&0<=f.indexOf(u)||"removeClass"==a&&-1==f.indexOf(u)?(v(),n()):(e.addClass(J),e.data(h,{running:!0,event:a,className:c,structural:!z,animations:y,done:x}),p(y,"before",x)))}}else v(),
w()}function E(a){a=l(a);m(a.querySelectorAll("."+J),function(a){a=k.element(a);var e=a.data(h);e&&(L(e.animations),A(a))})}function L(a){m(a,function(c){a.beforeComplete||(c.beforeEnd||s)(!0);a.afterComplete||(c.afterEnd||s)(!0)})}function A(a){l(a)==l(n)?g.disabled||(g.running=!1,g.structural=!1):(a.removeClass(J),a.removeData(h))}function K(a,c){if(g.disabled)return!0;if(l(a)==l(n))return g.disabled||g.running;do{if(0===c.length)break;var e=l(c)==l(n),f=e?g:c.data(h),f=f&&(!!f.disabled||!!f.running);
if(e||f)return f;if(e)break}while(c=c.parent());return!0}n.data(h,g);q.$$postDigest(function(){q.$$postDigest(function(){g.running=!1})});return{enter:function(a,c,e,f){this.enabled(!1,a);H.enter(a,c,e);q.$$postDigest(function(){p("enter","ng-enter",a,c,e,s,f)})},leave:function(a,c){E(a);this.enabled(!1,a);q.$$postDigest(function(){p("leave","ng-leave",a,null,null,function(){H.leave(a)},c)})},move:function(a,c,e,f){E(a);this.enabled(!1,a);H.move(a,c,e);q.$$postDigest(function(){p("move","ng-move",
a,c,e,s,f)})},addClass:function(a,c,e){p("addClass",c,a,null,null,function(){H.addClass(a,c)},e)},removeClass:function(a,c,e){p("removeClass",c,a,null,null,function(){H.removeClass(a,c)},e)},enabled:function(a,c){switch(arguments.length){case 2:if(a)A(c);else{var e=c.data(h)||{};e.disabled=!0;c.data(h,e)}break;case 1:g.disabled=!a;break;default:a=!g.disabled}return!!a}}}]);G.register("",["$window","$sniffer","$timeout",function(h,g,I){function n(d){R.push(d);I.cancel(S);S=I(function(){m(R,function(d){d()});
R=[];S=null;D={}},10,!1)}function t(d,a){var b=a?D[a]:null;if(!b){var e=0,c=0,f=0,l=0,g,k,n,p;m(d,function(d){if(d.nodeType==T){d=h.getComputedStyle(d)||{};n=d[B+G];e=Math.max(q(n),e);p=d[B+v];g=d[B+w];c=Math.max(q(g),c);k=d[x+w];l=Math.max(q(k),l);var a=q(d[x+G]);0<a&&(a*=parseInt(d[x+u],10)||1);f=Math.max(a,f)}});b={total:0,transitionPropertyStyle:p,transitionDurationStyle:n,transitionDelayStyle:g,transitionDelay:c,transitionDuration:e,animationDelayStyle:k,animationDelay:l,animationDuration:f};
a&&(D[a]=b)}return b}function q(d){var a=0;d=k.isString(d)?d.split(/\s*,\s*/):[];m(d,function(d){a=Math.max(parseFloat(d)||0,a)});return a}function J(d){var a=d.parent(),b=a.data(V);b||(a.data(V,++U),b=U);return b+"-"+l(d).className}function O(d,a){var b=J(d),e=b+" "+a,c={},f=D[e]?++D[e].total:0;if(0<f){var h=a+"-stagger",c=b+" "+h;(b=!D[c])&&d.addClass(h);c=t(d,c);b&&d.removeClass(h)}d.addClass(a);e=t(d,e);h=Math.max(e.transitionDuration,e.animationDuration);if(0===h)return d.removeClass(a),!1;var g=
"";0<e.transitionDuration?(d.addClass(y),g+=M+" ",l(d).style[B+v]="none"):l(d).style[x]="none 0s";m(a.split(" "),function(d,a){g+=(0<a?" ":"")+d+"-active"});d.data(z,{className:a,activeClassName:g,maxDuration:h,classes:a+" "+g,timings:e,stagger:c,ii:f});return!0}function p(d){var a=B+v;d=l(d);d.style[a]&&0<d.style[a].length&&(d.style[a]="")}function E(d){var a=x;d=l(d);d.style[a]&&0<d.style[a].length&&(d.style[a]="")}function L(a,c,f){function h(a){a.stopPropagation();var d=a.originalEvent||a;a=d.$manualTimeStamp||
d.timeStamp||Date.now();d=parseFloat(d.elapsedTime.toFixed(N));Math.max(a-x,0)>=v&&d>=p&&f()}var r=a.data(z),m=l(a);if(-1!=m.className.indexOf(c)&&r){var k=r.timings,n=r.stagger,p=r.maxDuration,q=r.activeClassName,v=1E3*Math.max(k.transitionDelay,k.animationDelay),x=Date.now(),w=Q+" "+P,u=r.ii,y,r="",s=[];if(0<k.transitionDuration){var t=k.transitionPropertyStyle;-1==t.indexOf("all")&&(y=!0,r+=b+"transition-property: "+t+", "+(g.msie?"-ms-zoom":"border-spacing")+"; ",r+=b+"transition-duration: "+
k.transitionDurationStyle+", "+k.transitionDuration+"s; ",s.push(b+"transition-property"),s.push(b+"transition-duration"))}0<u&&(0<n.transitionDelay&&0===n.transitionDuration&&(t=k.transitionDelayStyle,y&&(t+=", "+k.transitionDelay+"s"),r+=b+"transition-delay: "+A(t,n.transitionDelay,u)+"; ",s.push(b+"transition-delay")),0<n.animationDelay&&0===n.animationDuration&&(r+=b+"animation-delay: "+A(k.animationDelayStyle,n.animationDelay,u)+"; ",s.push(b+"animation-delay")));0<s.length&&(k=m.getAttribute("style")||
"",m.setAttribute("style",k+" "+r));a.on(w,h);a.addClass(q);return function(b){a.off(w,h);a.removeClass(q);e(a,c);b=l(a);for(var f in s)b.style.removeProperty(s[f])}}f()}function A(a,b,e){var c="";m(a.split(","),function(a,d){c+=(0<d?",":"")+(e*b+parseInt(a,10))+"s"});return c}function K(a,b){if(O(a,b))return function(c){c&&e(a,b)}}function a(a,b,c){if(a.data(z))return L(a,b,c);e(a,b);c()}function c(d,b,c){var e=K(d,b);if(e){var f=e;n(function(){p(d);E(d);f=a(d,b,c)});return function(a){(f||s)(a)}}c()}
function e(a,b){a.removeClass(b);a.removeClass(y);a.removeData(z)}function f(a,b){var c="";a=k.isArray(a)?a:a.split(/\s+/);m(a,function(a,d){a&&0<a.length&&(c+=(0<d?" ":"")+a+b)});return c}var b="",B,P,x,Q;C.ontransitionend===F&&C.onwebkittransitionend!==F?(b="-webkit-",B="WebkitTransition",P="webkitTransitionEnd transitionend"):(B="transition",P="transitionend");C.onanimationend===F&&C.onwebkitanimationend!==F?(b="-webkit-",x="WebkitAnimation",Q="webkitAnimationEnd animationend"):(x="animation",
Q="animationend");var G="Duration",v="Property",w="Delay",u="IterationCount",V="$$ngAnimateKey",z="$$ngAnimateCSS3Data",y="ng-animate-start",M="ng-animate-active",N=3,D={},U=0,R=[],S;return{allowCancel:function(a,b,c){var e=(a.data(z)||{}).classes;if(!e||0<=["enter","leave","move"].indexOf(b))return!0;var h=a.parent(),g=k.element(l(a).cloneNode());g.attr("style","position:absolute; top:-9999px; left:-9999px");g.removeAttr("id");g.html("");m(e.split(" "),function(a){g.removeClass(a)});g.addClass(f(c,
"addClass"==b?"-add":"-remove"));h.append(g);a=t(g);g.remove();return 0<Math.max(a.transitionDuration,a.animationDuration)},enter:function(a,b){return c(a,"ng-enter",b)},leave:function(a,b){return c(a,"ng-leave",b)},move:function(a,b){return c(a,"ng-move",b)},beforeAddClass:function(a,b,c){if(b=K(a,f(b,"-add")))return n(function(){p(a);E(a);c()}),b;c()},addClass:function(b,c,e){return a(b,f(c,"-add"),e)},beforeRemoveClass:function(a,b,c){if(b=K(a,f(b,"-remove")))return n(function(){p(a);E(a);c()}),
b;c()},removeClass:function(b,c,e){return a(b,f(c,"-remove"),e)}}}])}])})(window,window.angular);
//# sourceMappingURL=angular-animate.min.js.map