define(['underscore', 'backbone'], function(_, Backbone) {
  "use strict";
  
  console.log('EventBus.');

  var EventBus = _.extend({}, Backbone.Events);

  EventBus.attach = function(events, context) {
    _.each(events, _.bind(function(callback, eventName) {
      this.on(eventName, callback, context);
    }, this));
  };

  EventBus.unattach = function(events, context) {
    _.each(events, _.bind(function(callback, eventName) {
      this.off(eventName, callback, context);
    }, this));
  };

  var _trigger = EventBus.trigger;
  EventBus.trigger = function(events) {
    try {
      _trigger.apply(EventBus, arguments);
    } catch(ex) {
      console.error('EventBus ERROR: events: ' + events + ' exception: ', (ex.stack || ex.stacktrace || ex.message));
    }
    return EventBus;
  };

  return EventBus;
});
