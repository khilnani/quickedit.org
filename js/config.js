
define('config',[], function(){
  
  console.log('config.');
  
  require.config({
    baseUrl: './'
  });
  return {
    "paths": {
      "jquery": "libs/jquery/jquery-2.1.0.min",
      "underscore": "libs/underscore/underscore-1.6.0.min",
      "backbone": "libs/backbone/backbone-1.1.2.min",
      "sha256": "libs/movabletype/sha256",
      "aes": "libs/movabletype/aes",
      "jquery.autosize": "libs/jquery/plugins/jquery.autosize.min",
      "bootstrap": "libs/bootstrap/3.1.1/js/bootstrap.min",
      "bootbox": "libs/bootbox/bootbox.min",
      "add2home": "libs/add2home/add2home",
      "dropboxjs": "libs/dropbox/dropbox-0.10.2",
      
      "bootstrap.mods": "js/mods/bootstrap.mods",

      "console": "js/globals/console",
      "utils": "js/globals/utils",

      "dropbox": "js/dropbox",
      "dropins": "js/dropins",
      "core": "js/core",
    },
    "shim": {
      "jquery": ["console"],
      "jquery.autosize": ["jquery"],
      "backbone": ["underscore", "jquery"],
      "bootstrap": ["jquery"],
      "bootstrap.mods": ["bootstrap"]
    }
  };
});
