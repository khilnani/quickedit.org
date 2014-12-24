define([
  'jquery', 'underscore', 'globals/localstorage','globals/utils', 'views/base', 'globals/eventbus', 'bootbox', 'modules/cloudstore', 
  'libs/codemirror/lib/codemirror', 
  
  'css!libs/codemirror-mods/codemirror.css',
  'css!libs/codemirror/theme/eclipse.css',
  'css!libs/codemirror/theme/lesser-dark.css', 
  'css!libs/codemirror/theme/mbo.css', 
  'css!libs/codemirror/theme/mdn-like.css', 
  'css!libs/codemirror/theme/monokai.css', 
  'css!libs/codemirror/theme/paraiso-dark.css', 
  'css!libs/codemirror/theme/solarized.css', 
  'css!libs/codemirror/theme/twilight.css', 
  'css!libs/codemirror/theme/zenburn.css', 
  
  'add2home', 'css!libs/add2home/add2home.css', 'sha256', 'aes'], 
function($, _, localStorage, Utils, BaseView, EventBus, bootbox, CloudStore, CodeMirror) {
  "use strict";
  
  console.log("ContainerView.");
  
  var ContainerView = BaseView.extend({
  
    el: $('#container'),
    currentFolder: undefined,
    currentFile: undefined,
    editor: undefined,
    
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
      "click #logout": "logout",
      
      "click #keyMapVim": "toggleKeyMapVim",
      "click .cm-select-mode": "selectMode",
      "click .cm-select-theme": "selectTheme"
      
    },
    
    logout: function () {
      CloudStore.logout();
    },

    displayFileInfo: function (location, fileName) {
      this.currentFolder = location;
      this.currentFile = fileName;

      if(this.currentFolder) {
        var filePath = this.currentFolder.join('/') + '/' + fileName;
        $('#filePath').html( filePath );
      } else {
        $('#filePath').html( 'New' );
      }
    },
    
    readFile: function () {
      console.group("readFile");
      var promise = CloudStore.readFile( this.currentFolder );
      var self = this;
      
      promise.done( function( text, location, fileName ) {
        console.log("read: " + location.join('/') + ', ' + fileName);
        self.displayFileInfo( location, fileName);
        $('#message').val( text )
        EventBus.trigger('message:updated');
        console.groupEnd();
      });
      promise.fail( function( ) {
        console.log("read failed.");
        console.groupEnd();
      });
    },
    
    saveFile: function () {
      console.log("saveFile");

      var self = this;
      var promise = CloudStore.saveFile( $('#message').val(), this.currentFolder );
      
      promise.done( function( location, fileName) {
        console.log("saved: " + location.join('/') + ', ' + fileName);
        self.displayFileInfo( location, fileName);
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
        EventBus.trigger('message:updated');
      }
      console.groupEnd();
    },
    
    decryptMessage: function () {
      console.group("decryptMessage()");
      if( this.passwordsMatch() ) {  
        $('#message').val( this.decrypt( $('#message').val(), $('#password').val() ) );
        EventBus.trigger('message:updated');
      }
      console.groupEnd();
    },
    
    refreshMessage: function () {
      console.log("refreshMessage()");
      
      var m = $('#message');
      $("#count").text( m.val().length );
      m.autosize({ append: '\n'});
      m.trigger('autosize.resize');
    },
    
    clearMessage: function () {
      var self = this;
      bootbox.confirm("Clear message?", function(result) {
        if(result == true) {
          self.displayFileInfo();
          $('#message').val('');
          $('#message').trigger('change');
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
    
    toggleKeyMapVim: function () {
      if(this.editor.getOption("keyMap") == "vim") {
        this.editor.setOption("keyMap","default");  
        $('#keyMapVim').html('Mode: Vim');
        localStorage.setItem('keymap_value', "default");
        localStorage.setItem('keymap_label', 'Mode: Vim');
      } else {
        this.editor.setOption("keyMap","vim");
        $('#keyMapVim').html('<strong>Mode: Vim</strong>');
        localStorage.setItem('keymap_value', "vim");
        localStorage.setItem('keymap_label', '<strong>Mode: Vim</strong>');
      }
    },
    
    selectMode: function (event) {
      var id = $(event.target).data('id');
      var mode = $(event.target).data('mode');
      console.log("selectMode(): " + id + ', ' + mode);
      $('#cm-select-mode-btn').html( $(event.target).html() );
      if( ! mode ) {
        mode = id;
      }
      this.editor.setOption('mode', mode);
      localStorage.setItem('mode_id', id);
      localStorage.setItem('mode_value', mode);
      localStorage.setItem('mode_label', $(event.target).html());
    },
    
    selectTheme: function (event) {
      var id = $(event.target).data('id');
      console.log("selectTheme(): " + id);
      $('#cm-select-theme-btn').html( $(event.target).html() );
      this.editor.setOption('theme', id);
      localStorage.setItem('theme_value', id);
      localStorage.setItem('theme_label', $(event.target).html());
    },
  
    initialize: function(options) {
      console.log("ContainerView()");
      
      BaseView.prototype.initialize.call(this, options);
  
      var self = this;
      
      if( ! Utils.isMobile() ) {
        console.log('Initializing CodeMirror.');
        
        $('.desktop').removeClass('hidden');
        
        this.editor = CodeMirror.fromTextArea(document.getElementById("message"), {
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          lineWrapping: true,
          showCursorWhenSelecting: true,
          viewportMargin: Infinity,
          //mode: "text/x-csrc",
          keyMap: "default"
        });
        
        this.editor.on("change", function(editor, change) {
          editor.save();
          self.refreshMessage();
        });
        
        this.editor.on('keypress', function(editor, e) {
          //console.log(e.keyCode);
        });
        
        // set prior session config
        var keymap_value = localStorage.getItem('keymap_value');
        var keymap_label = localStorage.getItem('keymap_label');
        if(keymap_value && keymap_label) {
          this.editor.setOption("keyMap",keymap_value); 
          $('#keyMapVim').html(keymap_label);
        }
        
        var mode_value = localStorage.getItem('mode_value');
        var mode_label = localStorage.getItem('mode_label');
        if(mode_value && mode_label) {
          this.editor.setOption('mode', mode_value);
          $('#cm-select-mode-btn').html( mode_label );
        }
        
        var theme_value = localStorage.getItem('theme_value');
        var theme_label = localStorage.getItem('theme_label');
        if (theme_value && theme_label) {
          this.editor.setOption('theme', theme_value);
          $('#cm-select-theme-btn').html( theme_label );
        }
        
      }
  
      this.refreshMessage();

      EventBus.on('message:updated', function(){
        console.log('message:updated');
        
        if( ! Utils.isMobile() ) {
          this.editor.setValue( $('#message').val() );
        }
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
