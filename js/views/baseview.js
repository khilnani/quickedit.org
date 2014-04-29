define(['jquery', 'underscore', 'backbone', 'globals/utils', 'globals/eventbus', 'jquery.autosize', 'bootstrap', 'bootstrap.mods', 'bootbox'], 
function($, _, Backbone, Utils, EventBus) {
  "use strict";
  
  console.log("BaseView.");
  
  var BaseView = Backbone.View.extend({
  
    utils: Utils,
    options: {},
  
    initialize: function(options) {
      console.log("BaseView()");
      
      this.options = $.extend(true, {}, BaseView.prototype.options, options);
      
      if(this.model) {
        this.listenTo(this.model, "change", this.render);
      }
    },
    
    destroy: function() {    
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
