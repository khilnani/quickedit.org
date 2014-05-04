define(['jquery', 'bootbox', 'dropbox'], function ($, bootbox) {
  
  console.log('CloudStore.');
  
  var CloudStore = window.CloudStore = {  

    currentDir: '/',
    deferred: undefined,

    loadFile: function () {
      console.log("CloudStore.loadFile");
      CloudStore.deferred = $.Deferred();
      
      CloudStore.client.authenticate( function( error, data ) {
        console.log("CloudStore.loadFile/authenticate: error: " + error);
        if(error) {
          CloudStore.deferred.reject();
        } else {
          CloudStore.readDir();
        }
      });
      console.log("CloudStore.loadFile return deferred");
      return CloudStore.deferred;
    },
    
    saveFile: function (text) {
      console.log("CloudStore.saveFile");
      CloudStore.deferred = $.Deferred();
      CloudStore.deferred.resolve();
      return CloudStore.deferred;
    },

    readDir: function () {
      CloudStore.client.readdir( CloudStore.currentDir, function( error, entries ) {
        console.log("CloudStore.readDir/readdir: '" + CloudStore.currentDir + "' error: " + error);
        if(error) {
          CloudStore.deferred.reject();
        } else {
          console.log("CloudStore.readDir entries: " +  entries.length );
          CloudStore.deferred.resolve( entries.length );
        }
      });
    }
  };
  
  var Dropbox = window.Dropbox;  
  CloudStore.client = new Dropbox.Client({ key: "dzdofhi3xrasyw8" });
  CloudStore.client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://quickencrypt.org/oauth/dropbox.html"}));
  
  return CloudStore;

});
