require(['require-config'], function(config) {
  "use strict";
  
  console.log("main.");
  require.config(config);
  
  require(['views/container'], function(ContainerView) {
      console.log("main()");
      var containerView = new ContainerView();
      $('#splashscreen').delay( 1000 ).fadeOut('slow');
    }
  );
});
