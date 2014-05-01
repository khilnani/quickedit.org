define('require-config',[], function() {
  "use strict";
  
  console.log('require-config.');
  
  require.config({
    baseUrl: './static'
  });
  
  return {
    "paths": {
      "text": "libs/require/plugins/text",
      "css": "libs/require/plugins/css",
      "jquery": "libs/jquery/jquery-2.1.0.min",
      "jquery.autosize": "libs/jquery/plugins/jquery.autosize.min",
      "bootstrap": "libs/bootstrap/bootstrap-3.1.1.min",
      "bootstrap.mods": "mods/bootstrap.mods",
      "bootbox": "libs/bootbox/bootbox.min",
      "underscore": "libs/underscore/underscore-1.6.0.min",
      "backbone": "libs/backbone/backbone-1.1.2.min",
      "sha256": "libs/movabletype/sha256",
      "aes": "libs/movabletype/aes",
      "dropbox": "libs/dropbox/dropbox-0.10.2",
    },
    "shim": {
      "jquery": ["globals/console"],
      "jquery.autosize": ["jquery"],
      "backbone": ["underscore", "jquery"],
      "bootstrap": ["jquery"],
      "bootstrap.mods": ["bootstrap"]
    }
  };
});
