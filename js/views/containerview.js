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
  
  console.log("ContainerView.");
  
  var ContainerView = BaseView.extend({
  
    el: $('#container'),
    
    events: {
      "change #password": "passwordsMatch",
      "change #password2": "passwordsMatch",
      
      "click #encrypt": "encryptMessage",
      "click #decrypt": "decryptMessage",
      
      "click #message": "onMessageChange",
      "change #message": "onMessageChange",
      "click #clearMessage": "clearMessage",
      
      "click #backToTop": "backToTop",
    },
    
    encryptMessage: function() {
      console.log("encryptMessage()");
      if ( this.passwordsMatch() ) {
        $('#message').val( encrypt( $('#message').val(), $('#password').val() ) );
        EventBus.trigger('message:updated');
      }
    },
    
    decryptMessage: function () {
      console.log("decryptMessage()");
      if( this.passwordsMatch() ) {  
        $('#message').val( decrypt( $('#message').val(), $('#password').val() ) );
        EventBus.trigger('message:updated');
      }
    },
    
    onMessageChange: function () {
      console.log("onMessageChange()");
      var m = $('#message');
      $("#count").text( m.val().length );
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
      console.log("ContainerView()");
      
      BaseView.prototype.initialize.call(this, options);
      this.onMessageChange();

      EventBus.on('message:updated', function(){
        console.log('message:updated');
        $('#message').select();
        this.onMessageChange();
      }, this);
    },
    
    destroy: function() {
      EventBus.off('message:updated');
      BaseView.prototype.destroy.call(this);
    }
  });
  return ContainerView;
});
