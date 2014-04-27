require(['config'], function(config){
    require.config(config);

    /**
     * Start
     */
    require(
      [
        'sha256',
        'aes',
        'jquery',
        'jquery.autosize',
        'bootstrap',
        'bootstrap.mods',
        'bootbox',
        'add2home',
        'raven.setup',
        'utils',
        'dropins',
        'core'
      ],
      function(SiteManager, StateManager, Header) {
        console.log("Main()");
      }
    );
});

define("main", function(){
  console.log("main.js");
});
