define(['jquery', 'bootbox', 'dropbox'], function ($, bootbox) {
  
  console.log('CloudStore.');
  
  var CloudStore = {  
  
    loadFile: function () {
      console.log("CloudStore.loadFile");
      var deferred = $.Deferred();
      
      this.client.authenticate( function( error, data ) {
        console.log("CloudStore/authenticate: error: " + error);
      });
      
      deferred.resolve( 'test' );
      return deferred;
    },
    
    saveFile: function (text) {
      console.log("CloudStore.saveFile");
      var deferred = $.Deferred();
      deferred.resolve();
      return deferred;
    }
  };
  
  var Dropbox = window.Dropbox;  
  CloudStore.client = new Dropbox.Client({ key: "dzdofhi3xrasyw8" });
  CloudStore.client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://quickencrypt.org/oauth/dropbox.html"}));
  
  return CloudStore;

});