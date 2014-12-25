define(['jquery', 'underscore', 'backbone', 'bootbox', 'views/dropbox', 'dropbox'], function ($, _, Backbone, bootbox, DropboxView) {
  
  console.log('CloudStore.');
  
  var CloudStore = {  
    
    isLoggedIn: false,
    client: undefined,
    
    init: function () {
      console.log("CloudStore.init()");
      var Dropbox = window.Dropbox;
      this.client = new Dropbox.Client({ key: "e8u0xpa87ioumsw" });
      this.client.authDriver(new Dropbox.AuthDriver.Popup({rememberUser: true, receiverUrl: "https://quickedit.org/oauth/dropbox.html"}));
      
      this.client.authenticate( {interactive: false}, _.bind(function( error, data ) {
        console.log("CloudStore.init/authenticate: error: " + error);
        this.refreshStatus();
      }, this));
    },
    
    logout: function () {
      console.log("CloudStore.logout()");
      bootbox.confirm({ 
        title: "Logout?", 
        message: "<p>Click OK to log out.</p>", 
        callback: _.bind(function(result) {
          if(result == true) {
            this.client.signOut(_.bind( function() { 
              this.refreshStatus();
              this.logoutConfirm();
            }, this));
          }
        }, this) 
      });
    },

    logoutConfirm: function () {
      console.log("CloudStore.logoutConfirm()");
      bootbox.alert({ 
        title: "Logout successful", 
        message: "<p>You might still be logged in on Dropbox's website.</p><p class='text-danger'><em>Please click <a href='http://dropbox.com' target='_blank'>http://dropbox.com</a> and log out from Dropbox's website as well.</em></p>"
      });
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

    readFile: function (location) {
      console.log("CloudStore.readFile");
      return this.render('read', undefined, location);
    },
    
    saveFile: function ( fileData , location) {
      console.log("CloudStore.saveFile");
      return this.render('save', fileData, location);
    },
    
    render: function (mode, fileData, location) {
      console.log("CloudStore.render: " + mode + ', ' + location);
      
      var deferred = $.Deferred();
      var dropboxView = new DropboxView();
      
      this.client.authenticate( _.bind(function( error, data ) {
        console.log("CloudStore.render/authenticate: error: " + error);
        if(error) {
          deferred.reject();
        } else {
          dropboxView.show(this.client, deferred, mode, fileData, location);
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
