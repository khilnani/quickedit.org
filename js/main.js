require(['require-config'], function(config) {

  console.log("main.");
  require.config(config);
  
  require(['views/mainview'], function(MainView) {
      console.log("main()");
      mainView = new MainView();
    }
  );
});
