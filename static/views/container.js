define([
  'jquery', 'underscore', 'views/base', 'globals/eventbus', 'bootbox', 'modules/cloudstore', 'ace', 'codemirror', 
  'css!libs/codemirror/codemirror-4.8.0.css', 'add2home', 'css!libs/add2home/add2home.css', 'sha256', 'aes'], 
function($, _, BaseView, EventBus, bootbox, CloudStore, ace, CodeMirror) {
  "use strict";
  
  console.log("ContainerView.");
  
  var ContainerView = BaseView.extend({
  
    el: $('#container'),
    message: undefined,
    
    events: {
      "keyup #password": "passwordsMatch",
      "keyup #password2": "passwordsMatch",
      
      "click #encrypt": "encryptMessage",
      "click #decrypt": "decryptMessage",
      
      "click #message": "refreshMessage",
      "keyup #message": "refreshMessage",
      "click #clearMessage": "clearMessage",
      
      "click #dbChooseFile": "readFile",
      "click #dbSaveFile": "saveFile",
      
      "click #backToTop": "backToTop",
      
      "click #logout": "logout"
    },
    
    logout: function () {
      CloudStore.logout();
    },
    
    readFile: function () {
      console.group("readFile");
      var promise = CloudStore.readFile();
      var message = this.message;
      
      promise.done( function( text ) {
        console.log("read.");
        $('#message').val( text )
        //message.setValue( text );
        EventBus.trigger('message:updated');
        console.groupEnd();
      });
      promise.fail( function( ) {
        console.log("read failed.");
        console.groupEnd();
      });
    },
    
    saveFile: function () {
      console.group("saveFile");

      //var promise = CloudStore.saveFile( this.message.getValue() );
      var promise = CloudStore.saveFile( $('#message').val() );
      
      promise.done( function( ) {
        console.log("saved.");
        console.groupEnd();
      });
      promise.fail( function( ) {
        console.log("save failed.");
        console.groupEnd();
      });
    },
    
    encrypt: function (text, pass) {
      //console.log('pass:' + pass + ' encrypt IN:' + text);
      var key = Sha256.hash(pass);  
      var encrypted = Aes.Ctr.encrypt(text, key, 256);
      //console.log('encrypt OUT:' + encrypted);
      return encrypted;
    },
    
    decrypt: function (text, pass) {
      //console.log('pass:' + pass + ' decrypt IN:' + text);
      var key = Sha256.hash(pass);  
      var decrypted = Aes.Ctr.decrypt(text, key, 256);
      //console.log('decrypt OUT:' + decrypted);
      return decrypted;
    },
    
    encryptMessage: function() {
      console.group("encryptMessage()");
      if ( this.passwordsMatch() ) {
        $('#message').val( this.encrypt( $('#message').val(), $('#password').val() ) );
        //this.message.setValue( this.encrypt( this.message.getValue(), $('#password').val() ) );
        EventBus.trigger('message:updated');
      }
      console.groupEnd();
    },
    
    decryptMessage: function () {
      console.group("decryptMessage()");
      if( this.passwordsMatch() ) {  
        $('#message').val( this.decrypt( $('#message').val(), $('#password').val() ) );
        //this.message.setValue( this.decrypt( this.message.getValue(), $('#password').val() ) );
        EventBus.trigger('message:updated');
      }
      console.groupEnd();
    },
    
    refreshMessage: function () {
      console.log("refreshMessage()");
      
      var m = $('#message');
      $("#count").text( m.val().length );
      m.autosize({ append: '\n'});

      //$("#count").text( this.message.getValue().length );
      //this.message.renderer.adjustWrapLimit()
      //this.message.resize();
    },
    
    clearMessage: function () {
      var message = this.message;
      bootbox.confirm("Clear message?", function(result) {
        if(result == true) {
          $('#message').val('');
          $('#message').trigger('change');
          //message.setValue('');
          EventBus.trigger('message:updated');
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
      
      //this.message = window.ace.edit("message");
      //this.message.setOptions({
      //   minLines: 10,
      //   maxLines: 1000
      //});
      
      var editor = CodeMirror.fromTextArea(document.getElementById("message"), {
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true
      });
  
      this.refreshMessage();

      EventBus.on('message:updated', function(){
        console.log('message:updated');
        //$('#message').select();
        this.refreshMessage();
      }, this);
    },
    
    destroy: function() {
      EventBus.off('message:updated');
      BaseView.prototype.destroy.call(this);
    }
  });
  return ContainerView;
});
