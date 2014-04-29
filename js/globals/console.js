(function(){
    if(!window.console || !window.console.log) {
        var console = {};
        console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.time = console.timeEnd = console.assert = console.profile = function() {};
        window.console = console;
    }
    if (!window.console.group || !window.console.groupCollapsed || !window.console.groupEnd) {
        window.console.groupCollapsed = window.console.group = function(title){
            window.console.log(title);
        };
        window.console.groupEnd = function(){};
    }
})();

define("console", function(){});
