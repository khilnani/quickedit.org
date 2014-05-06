define(['jquery', 'underscore', 'backbone', 'bootbox', 'views/dropbox', 'dropbox'], function ($, _, Backbone, bootbox, DropboxView) {
  
  console.log('CloudStore.');
  
  var CloudStore = {  

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
      
      var deferred = $.Deferred();
      var dropboxView = new DropboxView();
      
      var Dropbox = window.Dropbox;
      var client = new Dropbox.Client({ key: "dzdofhi3xrasyw8" });
      client.authDriver(new Dropbox.AuthDriver.Popup({receiverUrl: "https://quickencrypt.org/oauth/dropbox.html"}));
      
      client.authenticate( function( error, data ) {
        console.log("CloudStore.render/authenticate: error: " + error);
        if(error) {
          deferred.reject();
        } else {
          dropboxView.readDir(client, deferred, mode);
        }
      });
      
      console.log("CloudStore.render return deferred");
      return deferred;
    }
  };
  
  return CloudStore;

});
