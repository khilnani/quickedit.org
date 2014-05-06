define(['jquery', 'underscore', 'backbone', 'globals/utils', 'globals/eventbus', 'jquery.autosize', 'bootstrap', 'bootstrap.mods', 'css!mods/bootstrap.mods.css', 'bootbox'], 
function($, _, Backbone, Utils, EventBus) {
  "use strict";
  
  console.log("BaseView.");
  
  var BaseView = Backbone.View.extend({
  
    utils: Utils,
    options: {},
  
    initialize: function(options) {
      //console.log("BaseView()");
      
      this.options = $.extend(true, {}, BaseView.prototype.options, options);
      
      if(this.model) {
        this.listenTo(this.model, "change", this.render);
      }
    },
    
    destroy: function() {
      console.log('BaseView.destroy()');
      
      if( this.beforeClose ) {
        this.beforeClose();
      }
      this.unbind();
      this.remove();
      delete this.$el;
      delete this.el;
    },
    
    render: function() {
      //this.$el.html(this.template(this.model.attributes));
    }
  });
  return BaseView;
});
