define(['jquery', 'bootbox', 'dropbox'], function ($, bootbox) {
  
  console.log('CloudStore.');
  
  var CloudStore = window.CloudStore = {  
  
    loadFile: function () {
      console.log("CloudStore.loadFile");
      var deferred = $.Deferred();
      
      CloudStore.client.authenticate( function( error, data ) {
        console.log("CloudStore.loadFile/authenticate: error: " + error);
        if(error) {
          deferred.reject();
        } else {
          CloudStore.client.getAccountInfo( function( error, userInfo ) {
            console.log("CloudStore.loadFile/getAccountInfo: error: " + error);
            if(error) {
              deferred.reject();
            } else {
              console.log("CloudStore.loadFile userInfo.name:" + userInfo.name );
              deferred.resolve( userInfo.name );
            }
          })
        }
      });
      console.log("CloudStore.loadFile return deferred");
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
