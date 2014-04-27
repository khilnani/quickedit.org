
define('config',[], function(){
  require.config({
    baseUrl: '/'
  });
  return {
    "paths": {
      "jquery": "libs/jquery/jquery-2.1.0.min",
      "underscore": "libs/underscore/underscore-1.6.0.min",
      "backbone": "libs/backbone/backbone-1.1.2.min",
      "sha256": "libs/movabletype/sha256",
      "aes": "libs/movabletype/aes",
      "autosize": "libs/jquery/jquery.autosize.min",
      "bootstrap": "libs/bootstrap/3.1.1/js/bootstrap.min",
      "bootbox": "libs/bootbox/bootbox.min",
      "add2home": "libs/add2home/add2home",
      "dropboxjs": "libs/dropbox/dropbox-0.10.2",
      "bootstrap.mods": "js/mods/bootstrap.mods",
      "utils": "js/global/utils",
      "dropbox": "js/dropbox",
      "dropins": "js/dropins",
      "core": "js/core",
    },
    "shim": {
      "jquery": ["console.setup"],
      "backbone": ["underscore", "jquery"]
    }
  };
});
