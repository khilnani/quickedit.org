define(['underscore', 'backbone'], function(_, Backbone) {
  "use strict";
  
  console.log('EventBus.');

  var EventBus = _.extend({}, Backbone.Events);
  
  EventBus.sub = function(event, callback, context) {
    this.on(event, callback, context);
  },
  
  EventBus.unsub = function(event, callback, context) {
    this.off(event, callback, context);
  },

  EventBus.pub = function(events) {
    try {
      this.trigger.apply(EventBus, arguments);
    } catch(ex) {
      console.error('EventBus Publish ERROR: events: ' + events + ' exception: ', (ex.stack || ex.stacktrace || ex.message));
    }
    return EventBus;
  };

  return EventBus;
});
