require(['require-config'], function(config) {
  "use strict";
  
  console.log("main.");
  require.config(config);
  
  require(['views/mainview'], function(MainView) {
      console.log("main()");
      var mainView = new MainView();
      $('#splashscreen').delay( 1000 ).fadeOut('slow');
    }
  );
});
