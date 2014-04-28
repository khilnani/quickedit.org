define('require-config',[], function(){
  
  console.log('require-config.');
  
  require.config({
    baseUrl: './js'
  });
  
  return {
    "paths": {
      "jquery": "libs/jquery/jquery-2.1.0.min",
      "underscore": "libs/underscore/underscore.min",
      "backbone": "libs/backbone/backbone-1.1.2.min",
      "sha256": "libs/movabletype/sha256",
      "aes": "libs/movabletype/aes",
      "jquery.autosize": "libs/jquery/plugins/jquery.autosize.min",
      "bootstrap": "libs/bootstrap/bootstrap-3.1.1.min",
      "bootbox": "libs/bootbox/bootbox.min",
      "add2home": "libs/add2home/add2home",
      "dropbox": "libs/dropbox/dropbox-0.10.2",
      
      "bootstrap.mods": "mods/bootstrap.mods",
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
