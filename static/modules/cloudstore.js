define(['jquery', 'bootbox', 'dropbox'], function ($, bootbox) {
  
  console.log('CloudStore.');
  
  window.CloudStore = {  
  
    loadFile: function () {
      console.log("CloudStore.loadFile");
      var deferred = $.Deferred();
      
      CloudStore.client.authenticate( function( error, data ) {
        console.log("CloudStore/authenticate: error: " + error);
        if(error) {
          deferred.reject();
        } else {
          CloudStore.client.getAccountInfo( function( error, userInfo ) {
            console.log("CloudStore/getAccountInfo: error: " + error);
            if(error) {
              deferred.reject();
            } else {
              console.log("userInfo.name:" + userInfo.name );
            }
          })
        }
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
  window.CloudStore.client = new Dropbox.Client({ key: "dzdofhi3xrasyw8" });
  window.CloudStore.client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://quickencrypt.org/oauth/dropbox.html"}));
  
  return window.CloudStore;

});
