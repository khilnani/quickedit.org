define(['jquery', 'underscore'], function($, _) {
  'use strict';
  
  console.log('Utils.');
  
  var Utils = {
  
    storage: {},
    baseUrl: window.location.protocol + '//' + window.location.host + '/',
    DEBUG: true,
    
    getUrlVars: function () {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
      }
      return vars;
    },
    
    set: function (key, value) {
      this.storage[key] = value;
    },
    
    get: function (key, defaultValue) {    
      if( this.storage[key] )
        return this.storage[key];        
      return defaultValue;
    }
  
  };
  
  return Utils;
  
});

