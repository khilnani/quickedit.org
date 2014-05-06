define(['jquery', 'underscore', 'backbone', 'bootbox', 'views/dropbox', 'dropbox'], function ($, _, Backbone, bootbox, DropboxView) {
  
  console.log('CloudStore.');
  
  var CloudStore = window.CloudStore = {  

    currentDir: '/',
    deferred: undefined,
    client: undefined,

    readFile: function () {
      console.log("CloudStore.readFile");
      return this.render('read');
    },
    
    saveFile: function () {
      console.log("CloudStore.saveFile");
      return this.render('save');
    },
    
    render: function (mode) {
      console.log("CloudStore.render: " + mode);
      this.deferred = $.Deferred();
      
      CloudStore.client.authenticate( function( error, data ) {
        console.log("CloudStore.render/authenticate: error: " + error);
        if(error) {
          CloudStore.deferred.reject();
        } else {
          var dropboxView = new DropboxView();
          dropboxView.readDir(CloudStore.client, CloudStore.deferred, mode);
        }
      });
      
      console.log("CloudStore.render return deferred");
      return this.deferred;
    }
  };
  
  var Dropbox = window.Dropbox;  
  CloudStore.client = new Dropbox.Client({ key: "dzdofhi3xrasyw8" });
  CloudStore.client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://quickencrypt.org/oauth/dropbox.html"}));
  
  return CloudStore;

});
