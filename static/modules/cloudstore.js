define(['jquery', 'underscore', 'backbone', 'bootbox', 'views/dropbox', 'dropbox'], function ($, _, Backbone, bootbox, DropboxView) {
  
  console.log('CloudStore.');
  
  var CloudStore = {  
    
    isLoggedIn: false,
    client: undefined,
    
    init: function () {
      console.log("CloudStore.init()");
      var Dropbox = window.Dropbox;
      this.client = new Dropbox.Client({ key: "dzdofhi3xrasyw8" });
      this.client.authDriver(new Dropbox.AuthDriver.Popup({rememberUser: true, receiverUrl: "https://quickencrypt.org/oauth/dropbox.html"}));
      
      this.client.authenticate( {interactive: false}, _.bind(function( error, data ) {
        console.log("CloudStore.init/authenticate: error: " + error);
        this.refreshStatus();
      }, this));
    },
    
    logout: function () {
      console.log("CloudStore.logout()");
      bootbox.confirm("Logout?", _.bind(function(result) {
        if(result == true) {
          this.client.signOut(_.bind( function() { 
            this.refreshStatus();
          }, this));
        }
      }, this));
    },
    
    refreshStatus: function () {
      console.log("CloudStore.refreshStatus: " + this.client.isAuthenticated() );
      if( this.client.isAuthenticated() ) 
      {
        $('#logout').removeClass('hidden');
      } else {
        $('#logout').addClass('hidden');
      }
    },

    readFile: function () {
      console.log("CloudStore.readFile");
      return this.render('read');
    },
    
    saveFile: function ( fileData ) {
      console.log("CloudStore.saveFile");
      return this.render('save', fileData);
    },
    
    render: function (mode, fileData) {
      console.log("CloudStore.render: " + mode);
      
      var deferred = $.Deferred();
      var dropboxView = new DropboxView();
      
      this.client.authenticate( _.bind(function( error, data ) {
        console.log("CloudStore.render/authenticate: error: " + error);
        if(error) {
          deferred.reject();
        } else {
          dropboxView.show(this.client, deferred, mode, fileData);
        }
        this.refreshStatus();
      }, this));
      
      console.log("CloudStore.render return deferred");
      return deferred;
    }
  };
  
  CloudStore.init();
  
  return CloudStore;

});
