define(['jquery', 'underscore', 'backbone', 'views/base', 'globals/eventbus', 'txt!views/dropbox.html', 'css!views/dropbox.css', 'dropbox'], 
function($, _, Backbone, BaseView, EventBus, tmpl, css) {
  "use strict";

  console.log("DropboxView.");
  
  var DropboxFile = Backbone.Model.extend({
    name: '..',
    type: 'file'
  });
  
  var DropboxFiles = Backbone.Collection.extend({
    model: DropboxFile
  });
  
  var DropboxView = BaseView.extend({
    
    tageName: 'ul',
    location: [],
    
    deferred: undefined,
    client: undefined,
    mode: undefined,
    
    select: function ( name ) {
      console.log('DropboxView.select: ' + name);
      this.location.push( name );
      
      this.refresh();
    },
    
    read: function ( name ) {
      console.log('DropboxView.select: ' + name);
      
      this.location.push( name );
      
      this.client.readFile( this.location.join('/'), _.bind(function (error, data) {
        this.deferred.resolve( data );
        this.destroy();
      }, this) );
    },
    
    back: function () {
      console.log('DropboxView.back');
      this.location.pop();
      
      this.refresh();
    },

    readDir: function (client, deferred, mode) {
      console.log('DropboxView.readDir: ' + mode);
      
      this.client = client;
      this.deferred = deferred;
      this.mode = mode;
      
      this.refresh();
    },
    
    refresh: function () {
      console.log("DropboxView.refresh: " + this.location.join('/') );
      this.client.readdir( this.location.join('/'), _.bind(function( error, entries, stat, entries_stat ) {
        console.log("DropboxView.refresh/readdir: '" + this.location.join('/') + "' isfile: " + stat.isFile + " error: " + error);
        if(error || stat.isFile) {
          this.deferred.reject();
        } else {
          console.log("DropboxView.refresh entries: " +  entries_stat.length );
          
          var files = [];
          
          if( this.location.length > 0) {
            files.push({name: '..', type: 'back'});
          }
          _.each( entries_stat, function (item) {
            if(item.isFolder)
            {
              files.push({name: item.name, type: 'dir'});
            } else {
              files.push({name: item.name, type: 'file'})
            }
            
            console.log(item);
          });
          
          this.collection = new DropboxFiles(files);
          $(document.body).append( this.render() );
        }
      }, this) );
    },
        
    render: function () {
      $(this.el).html('');
      
      this.collection.each( function(item) {
        var itemView = new DropboxItemView({model: item, parent: this });
        var renderHtml = itemView.render();
        this.$el.append(renderHtml);
      }, this);
      
      return this.el;
    },
    
    reset: function () {
      console.log('DropboxView.reset()');
      this.location = [];
      this.deferred = undefined;
      this.client = undefined;
      this.mode = undefined;
    },

    initialize: function (options) {
      console.log('DropboxView()');
      BaseView.prototype.initialize.call(this, options);
      this.reset();
    },

    destroy: function () {
      console.log('DropboxView.destroy()');
      this.reset();
      BaseView.prototype.destroy.call(this);
    } 
  });

  var DropboxItemView = BaseView.extend({
    
    tagName: 'li',
    parent: undefined,
    template: _.template( tmpl ),

    events: {
      "click .dplink": "click"
    },

    click: function () {
      console.log('DropboxItemView.click()');
      if(this.model.get('type') == 'dir') {
        this.parent.select( this.model.get('name') );
      } else if(this.model.get('type') == 'file') {
        this.parent.read( this.model.get('name') );
      } else if(this.model.get('type') == 'back') {
        this.parent.back();
      } else {
        console.error('Unknown DropboxItemView type: ' + this.model.get('type'));
      }
    },

    render: function () {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this.el;
    },

    initialize: function (options) {
      //console.log('DropboxItemView()');
      this.parent = options.parent;
      BaseView.prototype.initialize.call(this, options);
    },

    destroy: function () {
      console.log('DropboxItemView.destroy()');
      BaseView.prototype.destroy.call(this);
    }
    
  });
  
  return DropboxView;

})
