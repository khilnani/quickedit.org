function encrypt(text, pass) {
  //console.log('pass:' + pass + ' encrypt IN:' + text);
  var key = Sha256.hash(pass);  
  var encrypted = Aes.Ctr.encrypt(text, key, 256);
  //console.log('encrypt OUT:' + encrypted);
  return encrypted;
}

function decrypt (text, pass) {
  //console.log('pass:' + pass + ' decrypt IN:' + text);
  var key = Sha256.hash(pass);  
  var decrypted = Aes.Ctr.decrypt(text, key, 256);
  //console.log('decrypt OUT:' + decrypted);
  return decrypted;
}


define(['jquery', 'underscore', 'views/baseview', 'globals/eventbus', 'bootbox', 'add2home', 'modules/dropins', 'sha256', 'aes'], 
function($, _, BaseView, EventBus, bootbox) {
  "use strict";
  
  console.log("MainView.");
  
  var MainView = BaseView.extend({
  
    el: $('#container'),
    
    events: {
      "click #encrypt": "pageEncrypt",
      "click #decrypt": "pageDecrypt",
      
      "click #message": "onMessageChange",
      "change #message": "onMessageChange",
      "click #clearMessage": "clearMessage",
      
      "click #backToTop": "backToTop",
    },
    
    pageEncrypt: function() {
      console.log("pageEncrypt()");
      if ( this.passwordsMatch() ) {
        $('#message').val( encrypt( $('#message').val(), $('#password').val() ) );
        EventBus.trigger('main:message:updated');
      }
    },
    
    pageDecrypt: function () {
      console.log("pageDecrypt()");
      if( this.passwordsMatch() ) {  
        $('#message').val( decrypt( $('#message').val(), $('#password').val() ) );
        EventBus.trigger('main:message:updated');
      }
    },
    
    onMessageChange: function () {
      console.log("onMessageChange()");
      var m = $('#message');
    
      $("#count").text( m.val().length  );

      m.autosize({ append: '\n'});
      m.trigger('autosize.resize');

    },
    
    clearMessage: function () {
      bootbox.confirm("Clear message?", function(result) {
        if(result == true) {
          $('#message').val('');
          $('#message').trigger('change'); 
        }
      });
    },
    
    passwordsMatch: function () {
      console.log("passwordsMatch()");
  
      if( $('#password').val() == $('#password2').val() ) {
        $('#passGroup').removeClass("has-error");
        $('#passwordError').addClass("hidden");
        return true;
      }

      $('#passGroup').addClass("has-error");
      $('#passwordError').removeClass("hidden");
  
      this.backToTop();

      return false;
    },
    
    backToTop: function () {
      $("html, body").animate({ scrollTop: 0 }, "slow");
    },
  
    initialize: function(options) {
      console.log("MainView()");
      
      BaseView.prototype.initialize.call(this, options);
      this.onMessageChange();
      $('#splashscreen').delay( 1000 ).fadeOut('slow');
      
      EventBus.on('main:message:updated', function(){
        console.log('main:message:updated');
        $('#message').select();
        this.onMessageChange();
      }, this);
    },
    
    destroy: function() {
      EventBus.off('main:message:updated');
      BaseView.prototype.destroy.call(this);
    }
    
  });
  return MainView;
});
