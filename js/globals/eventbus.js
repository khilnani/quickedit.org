define(['underscore', 'backbone'], function(_, Backbone) {
  "use strict";
  
  console.log('EventBus.');

  var EventBus = _.extend({}, Backbone.Events);

  var _trigger = EventBus.trigger;
  EventBus.trigger = function(events) {
    try {
      console.log('EventBus.trigger: ' + arguments);
      _trigger.apply(EventBus, arguments);
    } catch(ex) {
      console.error('EventBus.trigger ERROR: events: ' + events + ' exception: ', (ex.stack || ex.stacktrace || ex.message));
    }
    return EventBus;
  };

  return EventBus;
});
