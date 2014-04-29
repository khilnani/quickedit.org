define(['jquery', 'underscore', 'backbone', 'globals/utils', 'globals/eventbus', 'jquery.autosize', 'bootstrap', 'bootstrap.mods', 'bootbox'], 
function($, _, Backbone, Utils, EventBus) {
  "use strict";
  
  console.log("BaseView.");
  
  var BaseView = Backbone.View.extend({
  
    utils: Utils,
    options: {},
  
    initialize: function(options) {
      console.log("BaseView()");
      
      this.DEBUG = Utils.DEBUG;
      this.options = $.extend(true, {}, BaseView.prototype.options, options);
      
      EventBus.attach(this.eventBus, this);
      this.listenTo(this.model, "change", this.render);
    },
    
    destroy: function() {    
      EventBus.unattach(this.eventBus, this);
      this.$el.remove();
      this.remove();
    },
    
    render: function() {
      //this.$el.html(this.template(this.model.attributes));
    }
  });
  return BaseView;
});
