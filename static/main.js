require(['require-config'], function(config) {
  "use strict";
  
  console.group("main.");
  require.config(config);
  
  require(['views/container'], function(ContainerView) {
      console.log("main()");
      console.groupEnd();

      var promise = $('#splashscreen').delay( 1000 ).fadeOut('slow').promise();
      
      promise.done( function () {
        console.group("Render ContainerView");
        var containerView = new ContainerView();
        console.groupEnd();
      });
      
    }
  );
});
